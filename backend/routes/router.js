//Importar dependências
const express = require("express");
const routerApp = express.Router();

const appLogin = require("../login/controller/ctlLogin");

//Rota de login
routerApp.post(["/Login", "/login"], appLogin.Login);
routerApp.post(["/Logout", "/logout"], appLogin.Logout);

//Rota para home
routerApp.get(["/home", "/Home"], appLogin.AutenticaJWT);

module.exports = routerApp;