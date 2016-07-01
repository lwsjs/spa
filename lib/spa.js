'use strict'

class SPA {
  optionDefinitions () {
    return [
      {
        name: 'spa', type: String, typeLabel: '[underline]{file}',
        description: 'Path to a Single Page App, e.g. app.html.'
      },
      {
        name: 'spa.asset-test', type: String, typeLabel: '[underline]{RegExp}',
        description: 'A regular expression to identify an asset file. Defaults to "\\.".'
      }
    ]
  }
  middleware (options) {
    const spa = options.spa
    if (spa) {
      const path = require('path')
      const send = require('koa-send')
      const _ = require('koa-route')
      return _.get('*', function spaMw (ctx, route, next) {
        const root = path.resolve(options['static.root'] || process.cwd())
        const assetTest = new RegExp(options['spa.asset-test'] || '\\.')
        if (ctx.accepts('text/html') && !assetTest.test(route)) {
          return send(ctx, spa, { root: root })
        } else {
          return send(ctx, route, { root: root })
        }
      })
    }
  }
}

module.exports = SPA
