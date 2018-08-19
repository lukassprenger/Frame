let Frame = require('./lib')
let Plugins = require('./lib/plugins.js')

Frame(__dirname)
  .source('src')
  .destination('dest')
  .meta({
    generator: 'Frame - a plugable static site generator',
    author: 'a Frame user'
  })
  .use(Plugins.markdown)
  .use(Plugins.layouts)
  .use(Plugins.permalinks)
  .build()
