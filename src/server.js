const express = require("express")
const server = express()

const app = express()

// pegar o banco de dados
const db = require("./database/db")

// configurar pasta public
server.use(express.static("public"))

// habilitar o uso do require.body na aplicação
server.use(express.urlencoded({ extended: true }))

// utilizando template engine
const nunjucks = require("nunjucks")
const { response, query } = require("express")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// configurar caminhos da app
// página inicial
// require: requisição
// response: resposta
server.get("/", (require, response) => {
    return response.render("index.html", { title: "" })
})

server.get("/create-point", (require, response) => {
    // query strings da nossa url
    // require.query

    return response.render("create-point.html")
})

server.post("/savepoint", (require, response) => {
    // body: corpo do formulário

    const query =
        `INSERT INTO places (
            name,
            image,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);`

    const values = [
        require.body.name,
        require.body.image,
        require.body.address,
        require.body.address2,
        require.body.state,
        require.body.city,
        require.body.items,
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return response.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso!")
        console.log(this)

        return response.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)
})

server.get("/search", (require, response) => {

    const search = require.query.search

    if (search == "") {
        // PESQUISA VAZIA
        return response.render("search-results.html", { total: 0 })
    }



    // pegar os dados do db
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length

        // mostrar a página html com os dados do db
        return response.render("search-results.html", { places: rows, total })

    })
})

// ligar o servidor
server.listen(3000)