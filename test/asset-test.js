const Tom = require('test-runner').Tom
const fetch = require('node-fetch')
const a = require('assert')

const tom = module.exports = new Tom({ maxConcurrency: 1 })

let server
const port = 8000

tom.before('before spaAssetTest', function () {
  const Spa = require('../')
  const Static = require('lws-static')
  const Lws = require('lws')
  const lws = Lws.create({
    port,
    stack: [ Spa, Static ],
    directory: 'test/fixture',
    spa: 'one.txt',
    spaAssetTest: 'txt'
  })
  server = lws.server
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

tom.test('existing static file failing asset-test', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/three`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('html requests for missing files with asset-test do not redirect to spa', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/asdf.txt`, { headers })
  a.strictEqual(response.status, 404)
})

tom.test('existing static file passing asset-test', async function () {
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

tom.test('existing static file with querystring containing "txt"', async function () {
  const response = await fetch(`http://localhost:${port}/two.txt?key=value.txt`)
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/two/.test(body))
})

tom.test('route with querystring, redirects to spa', async function () {
  const response = await fetch(`http://localhost:${port}/login?key=value`)
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('route with querystring containing "txt", redirects to spa', async function () {
  const response = await fetch(`http://localhost:${port}/login?key=value.txt`)
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.after('after spaAssetTest', function () {
  server.close()
})
