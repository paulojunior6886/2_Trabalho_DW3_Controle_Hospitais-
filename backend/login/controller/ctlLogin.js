//Importar bibliotecas e dependências
const jwt = require("jsonwebtoken");
const bCrypt = require("bcryptjs");
const mdlLogin = require("../model/mdlLogin");

//Função para autenticar usuário e gerar token JWT
const Login = async (req, res, next) => {
  const payload = req.body || {};
  const username = payload.username || payload.UserName || payload.userName;
  const password = payload.password || payload.Password || payload.pass;
  // Verificar se o usuário existe
  const credencial = await mdlLogin.GetCredencial(username);
  if (credencial.length == 0) {
    return res.status(401).json({ message: "Usuário não identificado!" });
  }
  // Verificar senha
  if (bCrypt.compareSync(password, credencial[0].password)) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: 600, //token expira em 10 minutos
    });
    return res.json({ auth: true, token: token });
  }
  res.status(401).json({ message: "Login inválido!" });
};

//Função para autenticar token JWT
function AutenticaJWT(req, res, next) {
  const tokenHeader = req.headers["authorization"];
  //Retorna erro se não for informado o token JWT
  if (!tokenHeader)
    return res
      .status(401)
      .json({ auth: false, message: "Não foi informado o token JWT" });
  const bearer = tokenHeader.split(" ");
  const token = bearer[1];
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    //Retorna erro se o token for inválido ou expirado
    if (err)
      return res
        .status(401)
        .json({ auth: false, message: "JWT inválido ou expirado" });
    req.userId = decoded.id;
    next();
  });
}
//Função para logout do usuário
const Logout = (req, res, next) => {
  res.json({ auth: false, token: null });
};

module.exports = {
  Login,
  Logout,
  AutenticaJWT,
};