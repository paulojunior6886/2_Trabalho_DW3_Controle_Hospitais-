const mdlConsultas = require("../model/mdlConsultas");

// Confere o ID recebido.
const LerID = (valor) => {
  if (!/^[1-9]\d*$/.test(String(valor))) {
    return null;
  }
  const numero = Number(valor);
  return Number.isSafeInteger(numero) ? numero : null;
};

// Confere os dados de uma consulta.
const ValidarConsulta = (body) => {
  const paciente_nome = typeof body?.paciente_nome === "string" ? body.paciente_nome.trim() : "";
  const data_consulta = body?.data_consulta;
  const valor = Number(body?.valor);
  const medico_id = LerID(body?.medico_id);
  const realizada = body?.realizada === true;

  if (!paciente_nome || paciente_nome.length > 100) {
    return { erro: "Informe o nome do paciente." };
  }

  if (typeof data_consulta !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data_consulta)) {
    return { erro: "Informe a data no formato AAAA-MM-DD." };
  }

  const data = new Date(data_consulta + "T00:00:00Z");
  if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== data_consulta) {
    return { erro: "Informe a data no formato AAAA-MM-DD." };
  }

  if (
    body?.valor === "" || 
    body?.valor == null || 
    !Number.isFinite(valor) || 
    valor < 0 || 
    valor > 99999999.99 || 
    Math.abs(valor * 100 - Math.round(valor * 100)) > 1e-7
  ) {
    return { erro: "Valor inválido (até duas casas decimais)." };
  }

  if (!medico_id) {
    return { erro: "Selecione um médico válido." };
  }

  if (body?.realizada !== undefined && typeof body.realizada !== "boolean") {
    return { erro: "Campo realizada inválido." };
  }

  return {
    dados: {
      paciente_nome,
      data_consulta,
      valor,
      realizada,
      medico_id
    }
  };
};

// Trata erros do módulo.
const Erro = (res, e) => {
  console.error("[Consultas]", e);
  return res.status(500).json({
    status: "erro",
    mensagem: "Falha no módulo de consultas."
  });
};

// Lista as consultas.
const GetAllConsultas = async (req, res) => {
  try {
    return res.json({
      status: "ok",
      registro: await mdlConsultas.GetAllConsultas()
    });
  } catch (e) {
    return Erro(res, e);
  }
};

// Busca a consulta pelo ID.
const GetConsultaByID = async (req, res) => {
  const id = LerID(req.params.consultaid);
  if (!id) {
    return res.status(400).json({
      status: "erro",
      mensagem: "ID inválido."
    });
  }

  try {
    const registro = await mdlConsultas.GetConsultaByID(id);
    if (!registro.length) {
      return res.status(404).json({
        status: "erro",
        mensagem: "Consulta não encontrada."
      });
    }
    return res.json({
      status: "ok",
      registro
    });
  } catch (e) {
    return Erro(res, e);
  }
};

// Cadastra uma consulta.
const InsertConsulta = async (req, res) => {
  const { erro, dados } = ValidarConsulta(req.body);
  if (erro) {
    return res.status(400).json({
      status: "erro",
      mensagem: erro
    });
  }

  try {
    const r = await mdlConsultas.InsertConsulta(dados);
    if (r.msg === "medico_invalido") {
      return res.status(400).json({
        status: "erro",
        mensagem: "Médico inexistente ou removido."
      });
    }
    return res.status(201).json({
      status: "ok",
      linhasAfetadas: r.linhasAfetadas,
      id: r.id
    });
  } catch (e) {
    return Erro(res, e);
  }
};

// Atualiza a consulta.
const UpdateConsulta = async (req, res) => {
  const id = LerID(req.params.consultaid);
  const { erro, dados } = ValidarConsulta(req.body);

  if (!id || erro) {
    return res.status(400).json({
      status: "erro",
      mensagem: erro || "ID inválido."
    });
  }

  try {
    const r = await mdlConsultas.UpdateConsulta(id, dados);
    if (r.msg === "medico_invalido") {
      return res.status(400).json({
        status: "erro",
        mensagem: "Médico inexistente ou removido."
      });
    }
    if (!r.linhasAfetadas) {
      return res.status(404).json({
        status: "erro",
        mensagem: "Consulta não encontrada."
      });
    }
    return res.json({
      status: "ok",
      linhasAfetadas: r.linhasAfetadas
    });
  } catch (e) {
    return Erro(res, e);
  }
};

// Remove a consulta logicamente.
const DeleteConsulta = async (req, res) => {
  const id = LerID(req.params.consultaid);
  if (!id) {
    return res.status(400).json({
      status: "erro",
      mensagem: "ID inválido."
    });
  }

  try {
    const r = await mdlConsultas.DeleteConsulta(id);
    if (!r.linhasAfetadas) {
      return res.status(404).json({
        status: "erro",
        mensagem: "Consulta não encontrada."
      });
    }
    return res.json({
      status: "ok",
      linhasAfetadas: r.linhasAfetadas
    });
  } catch (e) {
    return Erro(res, e);
  }
};

module.exports = {
  GetAllConsultas,
  GetConsultaByID,
  InsertConsulta,
  UpdateConsulta,
  DeleteConsulta
};
