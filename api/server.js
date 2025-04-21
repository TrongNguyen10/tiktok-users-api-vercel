// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server')

const server = jsonServer.create()

// Uncomment to allow write operations
const fs = require('fs')
const path = require('path')
const filePath = path.join('db.json')
const data = fs.readFileSync(filePath, 'utf-8')
const db = JSON.parse(data)
const router = jsonServer.router(db)

// Comment out to allow write operations
// const router = jsonServer.router('db.json')

const middlewares = jsonServer.defaults()

server.use(middlewares)

// CORS middleware – hỗ trợ cả local + Netlify
server.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'https://ndt-tiktokui.netlify.app/']
    const origin = req.headers.origin

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin)
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    next()
})

// Add this before server.use(router)
server.use(
    jsonServer.rewriter({
        '/api/*': '/$1',
        '/blog/:resource/:id/show': '/:resource/:id',
    }),
)
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
