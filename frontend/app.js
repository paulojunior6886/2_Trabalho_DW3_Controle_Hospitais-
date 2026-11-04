const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

const app = express();

const port = Number(
    process.env.FRONTEND_PORT || 40100
);

const backendUrl =
    process.env.PUBLIC_API_URL ||
    "http://localhost:40000";

// Configuração das páginas Nunjucks.
app.set("views", path.join(__dirname, "view"));
app.set("view engine", "njk");

nunjucks.configure(
    path.join(__dirname, "view"),
    {
        autoescape: true,
        express: app,
        noCache: true
    }
);

// Arquivos CSS, JS e imagens.
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.use(
    "/apps",
    express.static(
        path.join(__dirname, "apps")
    )
);

// Página inicial.
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Login.
app.get("/login", (req, res) => {
    res.render("loginView.njk", { backendUrl });
});

// Painel.
app.get("/home", (req, res) => {
    res.render("home.njk", {
        title: "Painel",
        activeMenu: "home",
        backendUrl
    });
});

// Páginas usadas pelos dois CRUDs.
function paginas(modulo, singular) {

    app.get("/" + modulo, (req, res) => {
        res.render(modulo + ".njk", {
            title: modulo,
            activeMenu: modulo,
            backendUrl
        });
    });

    app.get("/" + modulo + "/novo", (req, res) => {
        res.render(singular + "Form.njk", {
            operacao: "novo",
            id: "",
            activeMenu: modulo,
            backendUrl
        });
    });

    app.get("/" + modulo + "/editar/:id", (req, res) => {
        res.render(singular + "Form.njk", {
            operacao: "editar",
            id: req.params.id,
            activeMenu: modulo,
            backendUrl
        });
    });

    app.get("/" + modulo + "/visualizar/:id", (req, res) => {
        res.render(singular + "Form.njk", {
            operacao: "visualizar",
            id: req.params.id,
            activeMenu: modulo,
            backendUrl
        });
    });
}

paginas("medicos", "medico");
paginas("consultas", "consulta");

app.listen(port, "0.0.0.0", () => {
    console.log(`Front-End na porta ${port}`);
});