/* Requires */
let assert = require('assert'),
    fs = require('fs-extra'),
    readdir = require('recursive-readdir-synchronous'),
    matter = require('gray-matter')
/* Helper functions */
let isBoolean = function(b) {return typeof b === 'boolean'}
let isNumber = function(n) {return typeof n === 'number' && !Number.isNaN(n)}
let isObject = function(o) {return o !== null && typeof o === 'object'}
let isString = function(s) {return typeof s === 'string'}
/**
* Export Frame
*/
module.exports = Frame
/**
* Creates a new Frame object
*
* @constructor
* @param {String} directory - working directory as string
* @return {Object}
*/
function Frame(directory) {
  if(!(this instanceof Frame)) return new Frame(directory)
  assert(directory,'You must pass a valid directory string.')
  this.debug(false)
  this.directory(directory)
  this.plugins = []
  this.metadata = []
  this.source('src')
  this.clean(true)
  this.destination('build')
  this.files = []
  this.frontmatter(true)
  return this
}
/**
* Turns debug mode on or off.
* @param {Boolean} mode - sets debug mode to true or false
* @return {Object}
*/
Frame.prototype.debug = function(mode) {
  if(!arguments.length) return this._debug
  assert(isBoolean(mode),'Debug mode can only be set to true or false.')
  this._debug = mode
  if(mode === true) console.log('Turning debug mode on.')
  return this
}
/**
* Gets or sets the working directory.
* @param {String} [directory] - working directory as string
* @return {Object}
*/
Frame.prototype.directory = function(directory) {
  if(!arguments.length) return this._directory
  assert(isString(directory),'You must pass a valid working directory.')
  this._directory = directory
  if(this.debug() === true) console.log('Setting current working directory to ',directory)
  return this
}
/**
* Gets or sets the source directory.
* @param {String} [directory] - source directory as string
* @return {Object}
*/
Frame.prototype.source = function(directory) {
  if(!arguments.length) return this._source
  assert(isString(directory),'You must pass a valid source directory.')
  this._source = directory
  if(this.debug() === true) console.log('Setting source directory to ',directory)
  return this
}
/**
* Gets or sets the destination directory.
* @param {String} [directory] - destination directory as string
* @return {Object}
*/
Frame.prototype.destination = function(directory) {
  if(!arguments.length) return this._destination
  assert(isString(directory),'You must pass a valid destination directory.')
  this._destination = directory
  if(this.debug() === true) console.log('Setting destination directory to ',directory)
  return this
}
/**
* Adds a plugin to the plugin stack
*
* @param {Function} plugin - plugin function
* @return {Object}
*/
Frame.prototype.use = function(plugin){
  this.plugins.push(plugin)
  if(this.debug() === true) console.log('Using plugin ',plugin)
  return this
}
/**
* Gets or sets whether we will perform a clean build or not.
* @param {Boolean} clean - turns clean build on or off
* @return {Object}
*/
Frame.prototype.clean = function(clean) {
  if(!arguments.length) return this._clean
  assert(isBoolean(clean),'You must pass a boolean.')
  this._clean = clean
  if(this.debug() === true && this._clean === true) console.log('Perfoming a clean build.')
  return this
}
/**
* Gets or adds to ingored files.
* @param {String} ignore - File to ignore
* @return {Object}
*/
Frame.prototype.ignore = function(ignore) {
  if(!this._ignores) this._ignores = []
  if(!arguments.length) return this._ignores
  assert(isString(ignore),'You must pass a string.')
  this._ignores.push(ignore)
  if(this.debug() === true) console.log('Added ',ignore,' to ignored files.')
  return this
}
/**
* Turning frontmatter parsing on or off.
* @param {Boolean} frontmatter - boolean on or off
* @return {Object}
*/
Frame.prototype.frontmatter = function(frontmatter) {
  if(!arguments.length) return this._frontmatter
  assert(isBoolean(frontmatter),'You must pass a boolean.')
  this._frontmatter = frontmatter
  if(this.debug() === true && this._frontmatter === true) console.log('Frontmatter parsing is turned on.')
  return this
}
/**
* Reads a folder and creates the file array. If not specified, it uses the source
* directory. Processing each file.
* @param {String} dir - directory to read from
*/
Frame.prototype._readDir = function(dir) {
  dir = dir || this.source()
  let files = readdir(dir,this.ignore())
  files.forEach(function(file) {
    let path = '/' + file.replace('\\\\','/').replace('\\','/')
    let parsed = this._readFile(path)
    let f = {
      path: path,
      data: parsed.data,
      content: parsed.content
    }
    this.files.push(f)
  },this)
}
/**
* Reads a file. Parsing frontmatter if turned on.
* @param {String} file - patho to file
* @return {Object}
*/
Frame.prototype._readFile = function(file ) {
  if(this.debug() === true) console.log('Processing file: ', file)
  let path = this.directory() + file
  let context = fs.readFileSync(path,'utf-8')
  if(this.frontmatter()) {
    try{
      let parsed = matter(context)
      return parsed
    }
    catch(e) {
      let err = new Error('Invalid frontmatter at file ' + file)
      err.code = 'invalid_frontmatter'
      throw err
    }
  }
  else{
    return {
      data: null,
      content: context
    }
  }
}
/**
* Running a file trough the plugin stack.
*/
Frame.prototype._process = function() {
  if(this.debug() === true) console.log('Patching files trough plugin stack.')
  for(let i = 0; i < this.files.length; i++) {
    this.plugins.forEach(function(plugin) {
      this.files[i] = plugin(this.files[i])
    },this)
  }
}
/**
* Writes a files.
*/
Frame.prototype._writeFiles = function() {
  this.files.forEach(function(file) {
    if(this.debug() === true) console.log('Writing file: ', file.path)
    let path = this.destination() + '/' + file.path.replace('/' + this.source() + '/','')
    fs.outputFileSync(path,file.content)
  },this)
}
/**
* Building the site.
*/
Frame.prototype.build = function() {
  if(this.clean()) fs.removeSync(this.destination())
  this._readDir()
  this._process()
  this._writeFiles()
  return true
}
