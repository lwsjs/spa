'use strict'

class SPA {
  optionDefinitions () {
    return {
      name: 'spa', alias: 's', type: String, typeLabel: '[underline]{file}',
      description: 'Path to a Single Page App, e.g. app.html.'
    }
  }
  middleware (options) {
    const spa = options.spa || 'index.html'
    const assetTest = new RegExp(options['spa-asset-test'] || '\\.')
    if (spa) {
      const path = require('path')
      const send = require('koa-send')
      const _ = require('koa-route')
      return _.get('*', function spaMw (ctx, route, next) {
        const root = path.resolve(options.directory || process.cwd())
        if (ctx.accepts('text/html') && !assetTest.test(route)) {
          return send(ctx, spa, { root: root }).then(next)
        } else {
          return send(ctx, route, { root: root }).then(next)
        }
      })
    }
  }
}

module.exports = SPA
