const express = require("express");

const routerApp = express.Router();

const appLogin = require("../login/controller/ctlLogin");
const appMedicos = require("../medicos/controller/ctlMedicos");
const appConsultas = require("../consultas/controller/ctlConsultas");

// Login.
routerApp.post(["/Login", "/login"], appLogin.Login);
routerApp.post(["/Logout", "/logout"], appLogin.Logout);

// Rota protegida do painel.
routerApp.get("/home", appLogin.AutenticaJWT, (req, res) =>
  res.json({ status: "ok" }),
);

// APIs de médicos.
routerApp.get(
  "/getAllMedicos",
  appLogin.AutenticaJWT,
  appMedicos.GetAllMedicos,
);

routerApp.get(
  "/getMedicoByID/:medicoid",
  appLogin.AutenticaJWT,
  appMedicos.GetMedicoByID,
);

routerApp.post("/insertMedico", appLogin.AutenticaJWT, appMedicos.InsertMedico);

routerApp.put(
  "/updateMedico/:medicoid",
  appLogin.AutenticaJWT,
  appMedicos.UpdateMedico,
);

routerApp.delete(
  "/deleteMedico/:medicoid",
  appLogin.AutenticaJWT,
  appMedicos.DeleteMedico,
);

// APIs de consultas.
routerApp.get(
  "/getAllConsultas",
  appLogin.AutenticaJWT,
  appConsultas.GetAllConsultas,
);

routerApp.get(
  "/getConsultaByID/:consultaid",
  appLogin.AutenticaJWT,
  appConsultas.GetConsultaByID,
);

routerApp.post(
  "/insertConsulta",
  appLogin.AutenticaJWT,
  appConsultas.InsertConsulta,
);

routerApp.put(
  "/updateConsulta/:consultaid",
  appLogin.AutenticaJWT,
  appConsultas.UpdateConsulta,
);

routerApp.delete(
  "/deleteConsulta/:consultaid",
  appLogin.AutenticaJWT,
  appConsultas.DeleteConsulta,
);

module.exports = routerApp;
