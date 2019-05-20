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

tom.test('after', function () {
  server.close()
})

tom.test('before serve-existing', function () {
  const Spa = require('../')
  const Static = require('lws-static')
  const Lws = require('lws')
  const lws = new Lws()
  server = lws.listen({
    port,
    stack: [ Spa, Static ],
    directory: 'test/fixture',
    spa: 'one.txt',
    spaServeExisting: true
  })
})

tom.test('serveExisting: static asset without "." found', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/three`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/three/.test(body))
})

tom.test('serveExisting: / returns spa', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('serveExisting: missing file redirects to spa', async function () {
  const headers = { accept: 'text/html' }
  const response = await fetch(`http://localhost:${port}/asdf`, { headers })
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.ok(/one/.test(body))
})

tom.test('after serve-existing', function () {
  server.close()
})
