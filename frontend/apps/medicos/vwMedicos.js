
// Requisições das cinco APIs.
const GetAllMedicos = () => Api("/getAllMedicos");

const GetMedicoByID = (id) =>
    Api("/getMedicoByID/" + id);

const InsertMedico = (dados) =>
    Api("/insertMedico", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

const UpdateMedico = (id, dados) =>
    Api("/updateMedico/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

const DeleteMedico = (id) =>
    Api("/deleteMedico/" + id, {
        method: "DELETE"
    });

// Exibe os erros na página.
const MostrarErro = (id, erro) => {
    const aviso = document.getElementById(id);

    aviso.textContent = erro.message;
    aviso.classList.remove("d-none");
};

let listaMedicos = [];

// Monta as linhas da tabela.
const MostrarMedicos = (registros) => {

    const tbody = document.getElementById("corpoMedicos");

    tbody.replaceChildren();

    if (!registros.length) {

        const linha = tbody.insertRow();
        const col = linha.insertCell();

        col.colSpan = 5;
        col.textContent = "Nenhum médico encontrado.";

        return;
    }

    registros.forEach((medico) => {

        const linha = tbody.insertRow();

        [
            medico.id,
            medico.nome,
            medico.crm,
            medico.especialidade
        ].forEach((valor) => {
            linha.insertCell().textContent = valor;
        });

        const acoes = linha.insertCell();

        ["Visualizar", "Editar"].forEach((acao) => {

            const link = document.createElement("a");

            link.href =
                "/medicos/" +
                acao.toLowerCase() +
                "/" +
                medico.id;

            link.textContent = acao;
            link.className =
                "btn btn-sm btn-outline-primary me-2";

            acoes.appendChild(link);
        });

        const btn = document.createElement("button");

        btn.type = "button";
        btn.textContent = "Excluir";
        btn.className = "btn btn-sm btn-outline-danger";

        btn.onclick = async () => {

            if (!confirm(
                "Remover o médico " + medico.nome + "?"
            )) {
                return;
            }

            try {
                await DeleteMedico(medico.id);
                await CarregarMedicos();

            } catch (erro) {
                MostrarErro("mensagemMedicos", erro);
            }
        };

        acoes.appendChild(btn);
    });
};

// Busca os registros no servidor.
const CarregarMedicos = async () => {

    const dados = await GetAllMedicos();

    listaMedicos = dados.registro;

    document.getElementById("totalMedicos")
        .textContent = listaMedicos.length;

    MostrarMedicos(listaMedicos);
};

// Carrega a listagem e configura a pesquisa.
const IniciarMedicos = async () => {

    const busca = document.getElementById("buscaMedico");

    busca.addEventListener("input", () => {

        const p = busca.value.toLowerCase();

        MostrarMedicos(
            listaMedicos.filter((m) =>
                [
                    m.nome,
                    m.crm,
                    m.especialidade
                ].some((x) =>
                    x.toLowerCase().includes(p)
                )
            )
        );
    });

    try {
        await CarregarMedicos();

    } catch (erro) {
        MostrarErro("mensagemMedicos", erro);
    }
};

// Configura o formulário.
const IniciarFormMedico = async () => {

    const form = document.getElementById("formMedico");

    const id = form.dataset.id;
    const operacao = form.dataset.operacao;

    try {

        if (operacao !== "novo") {

            const { registro } = await GetMedicoByID(id);
            const medico = registro[0];

            document.getElementById("idMedico").value =
                medico.id;

            ["nome", "crm", "especialidade"].forEach(
                (campo) => {
                    document.getElementById(campo).value =
                        medico[campo];
                }
            );
        }

        if (operacao === "visualizar") {

            form.querySelectorAll("input").forEach(
                (elemento) => {
                    elemento.disabled = true;
                }
            );

            document.getElementById("salvarMedico")
                .classList.add("d-none");
        }

    } catch (erro) {

        MostrarErro("mensagemMedico", erro);

        document.getElementById("salvarMedico")
            .disabled = true;
    }

    form.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        if (operacao === "visualizar") {
            return;
        }

        const dados = Object.fromEntries(
            ["nome", "crm", "especialidade"].map(
                (campo) => [
                    campo,
                    document.getElementById(campo)
                        .value.trim()
                ]
            )
        );

        try {

            if (operacao === "novo") {
                await InsertMedico(dados);

            } else {
                await UpdateMedico(id, dados);
            }

            window.location.href = "/medicos";

        } catch (erro) {
            MostrarErro("mensagemMedico", erro);
        }
    });
};

// Identifica qual página está aberta.
document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("corpoMedicos")) {
        IniciarMedicos();
    }

    if (document.getElementById("formMedico")) {
        IniciarFormMedico();
    }
});
