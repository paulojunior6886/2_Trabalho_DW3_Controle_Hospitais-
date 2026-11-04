//importar bibliotecas
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

//criar instância do express
const app = express();
//definir a porta do servidor
const port = 40000;

// importar rotas
const router = require("./routes/router");

//configurar formato de interpretação de dados
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//configurar o CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

app.use(router);

//iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
