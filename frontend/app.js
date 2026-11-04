const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");

// Carrega as configurações do arquivo .env
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

// Cria o servidor Express do Front-End
const app = express();

// Configura a Porta do servidor e endereço da API Back-End
const port = process.env.FRONTEND_PORT || 40100;
const servidorDw3 = process.env.SERVIDOR_DW3 || "http://localhost:40000";

// Configuração do Nunjucks
app.set("views", path.join(__dirname, "view"));
app.set("view engine", "njk");

nunjucks.configure(path.join(__dirname, "view"), {
  autoescape: true,
  express: app,
  noCache: true,
});

// Disponibiliza os arquivos CSS, JS e imagens
app.use(express.static(path.join(__dirname, "public")));

// Disponibiliza os scripts dos módulos
app.use("/apps", express.static(path.join(__dirname, "apps")));

// Página inicial redireciona para o Login
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Página de Login
app.get("/login", (req, res) => {
  res.render("loginView.njk", {
    backendUrl: servidorDw3,
  });
});

// Página principal
app.get("/home", (req, res) => {
  res.render("home.njk", {
    title: "Painel principal",
    activeMenu: "home",
    backendUrl: servidorDw3,
  });
});

app.listen(port, () => {
  console.log(`Front-End rodando na porta ${port}`);
});