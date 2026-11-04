const db = require("../../database/databaseConfig");

// Consulta base que une os atendimentos aos médicos
const CONSULTA_BASE = `
  SELECT 
    c.id, 
    c.paciente_nome, 
    c.data_consulta::text AS data_consulta, 
    c.valor, 
    c.realizada, 
    c.medico_id, 
    c.removido, 
    m.nome AS medico_nome, 
    m.removido AS medico_removido 
  FROM consultas c 
  INNER JOIN medicos m ON m.id = c.medico_id
`;

// Lista as consultas ativas
const GetAllConsultas = async () => {
  const query = `
    ${CONSULTA_BASE}
    WHERE c.removido = false
    ORDER BY c.data_consulta DESC, c.id DESC
  `;
  return (await db.query(query)).rows;
};

// Busca uma consulta pelo ID
const GetConsultaByID = async (id) => {
  const query = `
    ${CONSULTA_BASE}
    WHERE c.id = $1 AND c.removido = false
  `;
  return (await db.query(query, [id])).rows;
};

// Confere se o médico existe e está ativo
const MedicoAtivo = async (id) => {
  const query = `
    SELECT id 
    FROM medicos 
    WHERE id = $1 AND removido = false
  `;
  const resultado = await db.query(query, [id]);
  return resultado.rowCount > 0;
};

// Cadastra uma nova consulta
const InsertConsulta = async (dados) => {
  if (!(await MedicoAtivo(dados.medico_id))) {
    return {
      msg: "medico_invalido",
      linhasAfetadas: 0
    };
  }

  const query = `
    INSERT INTO consultas (
      paciente_nome, 
      data_consulta, 
      valor, 
      realizada, 
      medico_id, 
      removido
    ) 
    VALUES ($1, $2, $3, $4, $5, false) 
    RETURNING id
  `;

  const resultado = await db.query(query, [
    dados.paciente_nome,
    dados.data_consulta,
    dados.valor,
    dados.realizada,
    dados.medico_id
  ]);

  return {
    msg: "ok",
    linhasAfetadas: resultado.rowCount,
    id: resultado.rows[0].id
  };
};

// Atualiza uma consulta existente
const UpdateConsulta = async (id, dados) => {
  if (!(await MedicoAtivo(dados.medico_id))) {
    return {
      msg: "medico_invalido",
      linhasAfetadas: 0
    };
  }

  const query = `
    UPDATE consultas 
    SET 
      paciente_nome = $2, 
      data_consulta = $3, 
      valor = $4, 
      realizada = $5, 
      medico_id = $6 
    WHERE id = $1 AND removido = false
  `;

  const resultado = await db.query(query, [
    id,
    dados.paciente_nome,
    dados.data_consulta,
    dados.valor,
    dados.realizada,
    dados.medico_id
  ]);

  return {
    msg: "ok",
    linhasAfetadas: resultado.rowCount
  };
};

// Realiza a exclusão lógica da consulta
const DeleteConsulta = async (id) => {
  const query = `
    UPDATE consultas 
    SET removido = true 
    WHERE id = $1 AND removido = false
  `;

  const resultado = await db.query(query, [id]);

  return {
    msg: "ok",
    linhasAfetadas: resultado.rowCount
  };
};

module.exports = {
  GetAllConsultas,
  GetConsultaByID,
  InsertConsulta,
  UpdateConsulta,
  DeleteConsulta
};
