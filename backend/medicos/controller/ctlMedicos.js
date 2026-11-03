
const mdlMedicos = require("../model/mdlMedicos");

// Confere se o ID é um inteiro positivo.
const LerID = (id) => {
    if (!/^[1-9]\d*$/.test(String(id))) {
        return null;
    }

    const numero = Number(id);

    return Number.isSafeInteger(numero)
        ? numero
        : null;
};

// Confere os campos enviados.
const ValidarMedico = (body) => {

    const nome =
        typeof body?.nome === "string"
            ? body.nome.trim()
            : "";

    const crm =
        typeof body?.crm === "string"
            ? body.crm.trim()
            : "";

    const especialidade =
        typeof body?.especialidade === "string"
            ? body.especialidade.trim()
            : "";

    if (
        !nome ||
        nome.length > 100 ||
        !crm ||
        crm.length > 30 ||
        !especialidade ||
        especialidade.length > 100
    ) {
        return null;
    }

    return {
        nome,
        crm,
        especialidade
    };
};

// Trata erros das operações.
const Erro = (res, e) => {

    console.error("[Médicos]", e);

    if (e.code === "23505") {
        return res.status(409).json({
            status: "erro",
            mensagem: "CRM já cadastrado."
        });
    }

    return res.status(500).json({
        status: "erro",
        mensagem: "Falha no módulo de médicos."
    });
};

// Busca todos os médicos.
const GetAllMedicos = async (req, res) => {
    try {
        return res.json({
            status: "ok",
            registro: await mdlMedicos.GetAllMedicos()
        });

    } catch (e) {
        return Erro(res, e);
    }
};

// Busca um médico pelo ID.
const GetMedicoByID = async (req, res) => {

    const id = LerID(req.params.medicoid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID inválido."
        });
    }

    try {
        const registro = await mdlMedicos.GetMedicoByID(id);

        if (!registro.length) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Médico não encontrado."
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

// Cadastra um médico.
const InsertMedico = async (req, res) => {

    const dados = ValidarMedico(req.body);

    if (!dados) {
        return res.status(400).json({
            status: "erro",
            mensagem: "Preencha nome, CRM e especialidade."
        });
    }

    try {
        const resultado = await mdlMedicos.InsertMedico(dados);

        return res.status(201).json({
            status: "ok",
            linhasAfetadas: resultado.rowCount,
            id: resultado.rows[0].id
        });

    } catch (e) {
        return Erro(res, e);
    }
};

// Atualiza os dados do médico.
const UpdateMedico = async (req, res) => {

    const id = LerID(req.params.medicoid);
    const dados = ValidarMedico(req.body);

    if (!id || !dados) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID ou dados inválidos."
        });
    }

    try {
        const resultado = await mdlMedicos.UpdateMedico(
            id,
            dados
        );

        if (!resultado.rowCount) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Médico não encontrado."
            });
        }

        return res.json({
            status: "ok",
            linhasAfetadas: resultado.rowCount
        });

    } catch (e) {
        return Erro(res, e);
    }
};

// Remove o médico logicamente.
const DeleteMedico = async (req, res) => {

    const id = LerID(req.params.medicoid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID inválido."
        });
    }

    try {
        const resultado = await mdlMedicos.DeleteMedico(id);

        if (!resultado.rowCount) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Médico não encontrado."
            });
        }

        return res.json({
            status: "ok",
            linhasAfetadas: resultado.rowCount
        });

    } catch (e) {
        return Erro(res, e);
    }
};

module.exports = {
    GetAllMedicos,
    GetMedicoByID,
    InsertMedico,
    UpdateMedico,
    DeleteMedico
};
