const express = require("express")
const server = express()

// configurar pasta public
server.use(express.static("public"))



// utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// configurar caminhos da app
// página inicial
// require: requisição
// response: resposta
server.get("/", (require, response) => {
    return response.render("index.html", { title: ""})
})

server.get("/create-point", (require, response) => {
    return response.render("create-point.html")
})

server.get("/search", (require, response) => {
    return response.render("search-results.html")
})

// ligar o servidor
server.listen(3000)