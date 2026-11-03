
const db = require("../../database/databaseConfig");

// Lista apenas médicos ativos.
const GetAllMedicos = async () => (
    await db.query(
        "SELECT * FROM medicos " +
        "WHERE removido = false ORDER BY nome"
    )
).rows;

// Busca um médico pelo ID.
const GetMedicoByID = async (id) => (
    await db.query(
        "SELECT * FROM medicos " +
        "WHERE id = $1 AND removido = false",
        [id]
    )
).rows;

// Cadastra um médico.
const InsertMedico = async (dados) => (
    await db.query(
        "INSERT INTO medicos " +
        "(nome, crm, especialidade, removido) " +
        "VALUES ($1, $2, $3, false) RETURNING id",
        [
            dados.nome,
            dados.crm,
            dados.especialidade
        ]
    )
);

// Atualiza os dados do médico.
const UpdateMedico = async (id, dados) => (
    await db.query(
        "UPDATE medicos SET " +
        "nome = $2, " +
        "crm = $3, " +
        "especialidade = $4 " +
        "WHERE id = $1 AND removido = false",
        [
            id,
            dados.nome,
            dados.crm,
            dados.especialidade
        ]
    )
);

// Exclusão lógica.
const DeleteMedico = async (id) => (
    await db.query(
        "UPDATE medicos SET removido = true " +
        "WHERE id = $1 AND removido = false",
        [id]
    )
);

module.exports = {
    GetAllMedicos,
    GetMedicoByID,
    InsertMedico,
    UpdateMedico,
    DeleteMedico
};
