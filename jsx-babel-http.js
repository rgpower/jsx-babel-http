const http = require('http')
const babel = require('@babel/core')

const options = {
    plugins: [
        ['@babel/plugin-transform-react-jsx', {
            runtime: 'classic',
            useSpread: true
        }]
    ]
}

http.createServer((req, res) => {
    const body = []
    req.on('data', chunk => {
        body.push(chunk)
    })
    req.on('end', () => {
        const obj = JSON.parse(Buffer.concat(body).toString())
        babel.transform(obj['sourceCode'], options, function(err, result) {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'})
                res.end(err.message)
            } else {
                res.writeHead(200, {'Content-Type': 'application/javascript'})
                res.end(result.code)
            }
        })

    })
}).listen(4443)
