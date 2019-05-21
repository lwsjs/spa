const Tom = require('test-runner').Tom
const fetch = require('node-fetch')
const a = require('assert')

const tom = module.exports = new Tom('spa', { concurrency: 1 })

let server
const port = 8000

tom.test('before', function () {
  const Spa = require('../')
  const Static = require('lws-static')
  const Lws = require('lws')
  const lws = new Lws()
  server = lws.listen({
    port,
    stack: [ Spa, Static ],
    directory: 'test/fixture',
    spa: 'one.txt'
  })
})

tom.test('missing file redirects to spa', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/asdf`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('/ returns spa', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('static asset without "." not found by default', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/three`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('html requests for missing files with extensions do not redirect to spa', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/asdf.txt`, { headers })
  a.strictEqual(response.status, 404)
})

tom.test('existing static file', async function () {
  const response = await fetch(`http://localhost:${port}/two.txt`)
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/two/.test(body))
})

tom.test('not a text/html request - does not redirect to spa', async function () {
  const headers = { accept: 'application/json' }
  const response = await fetch(`http://localhost:${port}/asdf`, { headers })
  a.strictEqual(response.status, 404)
})

tom.test('existing static file with querystring', async function () {
  const response = await fetch(`http://localhost:${port}/two.txt?key=value`)
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/two/.test(body))
})

tom.test('after', function () {
  server.close()
})

tom.test('before spaAssetTestFs', function () {
  const Spa = require('../')
  const Static = require('lws-static')
  const Lws = require('lws')
  const lws = new Lws()
  server = lws.listen({
    port,
    stack: [ Spa, Static ],
    directory: 'test/fixture',
    spa: 'one.txt',
    spaAssetTestFs: true
  })
})

tom.test('spaAssetTestFs: missing file redirects to spa', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/asdf`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('spaAssetTestFs: missing file redirects to spa, deep', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/dir/asdf`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('spaAssetTestFs: / returns spa', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('spaAssetTestFs: static asset without "." found', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/three`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/three/.test(body))
})

tom.test('spaAssetTestFs: static asset without "." found, deep', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/dir/five`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/five/.test(body))
})

tom.test('spaAssetTestFs: html requests for missing files with extensions returns spa', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/asdf.txt`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('spaAssetTestFs: existing static file', async function () {
  const response = await fetch(`http://localhost:${port}/two.txt`)
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/two/.test(body))
})

tom.test('spaAssetTestFs: existing static file, deep', async function () {
  const response = await fetch(`http://localhost:${port}/dir/four.txt`)
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/four/.test(body))
})

tom.test('spaAssetTestFs: not a text/html request - does not redirect to spa', async function () {
  const headers = { accept: 'application/json' }
  const response = await fetch(`http://localhost:${port}/asdf`, { headers })
  a.strictEqual(response.status, 404)
})

tom.test('spaAssetTestFs: special characters in route', async function () {
  const headers = { accept: 'application/json' }
  const response = await fetch(encodeURI(`http://localhost:${port}/!"£$%^&*()_+}{#;/.,`), { headers })
  a.strictEqual(response.status, 404)
})

tom.test('spaAssetTestFs: existing static file with querystring', async function () {
  const response = await fetch(`http://localhost:${port}/two.txt?key=value`)
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/two/.test(body))
})

tom.test('after spaAssetTestFs', function () {
  server.close()
})

tom.test('before spaAssetTest', function () {
  const Spa = require('../')
  const Static = require('lws-static')
  const Lws = require('lws')
  const lws = new Lws()
  server = lws.listen({
    port,
    stack: [ Spa, Static ],
    directory: 'test/fixture',
    spa: 'one.txt',
    spaAssetTest: 'txt'
  })
})

tom.test('spaAssetTest: missing file redirects to spa', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/asdf`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('spaAssetTest: / returns spa', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('spaAssetTest: existing static file failing asset-test', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/three`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('spaAssetTest: html requests for missing files with asset-test do not redirect to spa', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/asdf.txt`, { headers })
  a.strictEqual(response.status, 404)
})

tom.test('spaAssetTest: existing static file passing asset-test', async function () {
  const response = await fetch(`http://localhost:${port}/two.txt`)
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/two/.test(body))
})

tom.test('spaAssetTest: not a text/html request - does not redirect to spa', async function () {
  const headers = { accept: 'application/json' }
  const response = await fetch(`http://localhost:${port}/asdf`, { headers })
  a.strictEqual(response.status, 404)
})

tom.test('spaAssetTest: existing static file with querystring', async function () {
  const response = await fetch(`http://localhost:${port}/two.txt?key=value`)
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/two/.test(body))
})

tom.test('after spaAssetTest', function () {
  server.close()
})
