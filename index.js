module.exports = MiddlewareBase => class SPA extends MiddlewareBase {
  description () {
    return 'Support for Single Page Applications.'
  }

  optionDefinitions () {
    return [
      {
        name: 'spa',
        type: String,
        alias: 's',
        typeLabel: '{underline file}',
        description: 'Path to a Single Page App, e.g. app.html.'
      },
      {
        name: 'spa.asset-test',
        type: String,
        typeLabel: '{underline RegExp}',
        description: 'A regular expression to identify an asset file. Defaults to "\\.".'
      },
      {
        name: 'spa.serve-existing',
        type: Boolean,
        description: 'Check if the requested file exists on disk, and if so, serve it as asset. If specified, `spa.asset-test` will be ignored.'
      }
    ]
  }

  middleware (options) {
    const spa = options.spa
    if (spa) {
      const path = require('path')
      const root = path.resolve(options.directory || process.cwd())
      this.emit('verbose', 'middleware.spa.config', { spa, root, assetTest: options.spaAssetTest })
      return function (ctx, next) {
        const route = ctx.request.url
        let isStatic = false
        if (options.spaAssetTest) {
          const re = new RegExp(options.spaAssetTest)
          isStatic = re.test(route)
        } else if (options.spaServeExisting && route !== '/') {
          const fs = require('fs')
          const path = require('path')
          const filePath = path.join(root, route)
          isStatic = fs.existsSync(filePath)
        } else {
          isStatic = /\./.test(route)
        }
        if (ctx.accepts('text/html') && !isStatic) {
          const send = require('koa-send')
          return send(ctx, spa, { root })
        } else {
          return next()
        }
      }
    }
  }
}
