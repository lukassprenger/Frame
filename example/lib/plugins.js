let marked = require('marked')
let handlebars = require('handlebars'),
    fs = require('fs-extra')

function markdown(file,Frame) {
  file.content = marked(file.content)
  return file
}
function layouts(file,Frame) {
  if(file.data.layout) {
    let path = 'layouts/' + file.data.layout + '.html'
    let context = fs.readFileSync(path,'utf-8')
    let template = handlebars.compile(context)
    file.content = template(file)
    let end = file.path.split('.').reverse()
    file.path = file.path.replace('.' + end[0],'.html')
    return file
  }
  else{
    return file
  }
}
function permalinks(file,Frame) {
  let path = file.path.replace('\\','/')
  if(path.split('/').length !== 3) {
    let end = '.' + path.split('.').reverse() [0]
    path = path.replace(end,'/index.html')
    file.path = path
  }
  return file
}

module.exports = {
  markdown: markdown,
  layouts: layouts,
  permalinks: permalinks
}
