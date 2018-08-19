# Frame

Static site generator build in nodejs. Heavily inspired by Metalsmith.

## Quick start guide

If you want to get started with Frame. Here is a quick start snippet to lift you high into the sky...
Frame comes with a basic plugin set included.

```javascript
let Frame = require('./lib')
let Plugins = require('./lib/plugins.js')

Frame(__dirname)
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

## Installation

Simply clone the git directory.

```
git clone https://github.com/lukassprenger/Frame.git
```

## Writing your own plugins

Every plugin is a function taking the file and a global Frame object as parameters. It changes the file and returns it.

```
function plugin(file,Frame) {
  //do whatever you want here
  return file
}
```
