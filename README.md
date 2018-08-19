# Frame

Static site generator build in nodejs. Heavily inspired by Metalsmith.

## Quick start guide

If you want to get started with Frame. Here is a quick start snippet to lift you high into the sky...
Frame comes with a basic plugin set included.

```javascript
let Frame = require('./lib')
let Plugins = require('./lib/plugins.js')

Frame(__dirname')
  .source('src')
  .destiantion('dest')
  .meta({
    generator: 'Frame - a plugable static site generator',
    author: 'a Frame user'
  })
  .use(Plugins.markdown)
  .use(Plugins.layouts)
  .use(Plugins.permalinks)
  .build()
```
