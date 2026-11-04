// Chamadas das cinco APIs de consultas.
const GetAllConsultas = () => Api("/getAllConsultas");

const GetConsultaByID = (id) => Api("/getConsultaByID/" + id);

const InsertConsulta = (dados) =>
  Api("/insertConsulta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

const UpdateConsulta = (id, dados) =>
  Api("/updateConsulta/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

const DeleteConsulta = (id) =>
  Api("/deleteConsulta/" + id, {
    method: "DELETE",
  });

// Carrega os médicos cadastrados.
const BuscarMedicos = () => Api("/getAllMedicos");

const MostrarErro = (id, erro) => {
  const aviso = document.getElementById(id);
  aviso.textContent = erro.message;
  aviso.classList.remove("d-none");
};

let listaConsultas = [];

// Preenche a tabela de consultas.
const MostrarConsultas = (registros) => {
  const tbody = document.getElementById("corpoConsultas");
  tbody.replaceChildren();

  if (!registros.length) {
    const linha = tbody.insertRow();
    const c = linha.insertCell();
    c.colSpan = 7;
    c.textContent = "Nenhuma consulta encontrada.";
    return;
  }

  registros.forEach((consulta) => {
    const linha = tbody.insertRow();

    [
      consulta.id,
      consulta.paciente_nome,
      consulta.medico_nome + (consulta.medico_removido ? " (removido)" : ""),
      consulta.data_consulta,
      Number(consulta.valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      consulta.realizada ? "Sim" : "Não",
    ].forEach((valor) => {
      linha.insertCell().textContent = valor;
    });

    const acoes = linha.insertCell();

    ["Visualizar", "Editar"].forEach((acao) => {
      const link = document.createElement("a");
      link.href = "/consultas/" + acao.toLowerCase() + "/" + consulta.id;
      link.textContent = acao;
      link.className = "btn btn-sm btn-outline-primary me-2";
      acoes.appendChild(link);
    });

    const btn = document.createElement("button");
    btn.textContent = "Excluir";
    btn.type = "button";
    btn.className = "btn btn-sm btn-outline-danger";
    
    btn.onclick = async () => {
      if (!confirm("Remover consulta de " + consulta.paciente_nome + "?")) {
        return;
      }
      try {
        await DeleteConsulta(consulta.id);
        await CarregarConsultas();
      } catch (erro) {
        MostrarErro("mensagemConsultas", erro);
      }
    };
    
    acoes.appendChild(btn);
  });
};

// Recarrega os registros.
const CarregarConsultas = async () => {
  const { registro } = await GetAllConsultas();
  listaConsultas = registro;
  document.getElementById("totalConsultas").textContent = registro.length;
  MostrarConsultas(registro);
};

// Configura a listagem e a pesquisa.
const IniciarConsultas = async () => {
  const busca = document.getElementById("buscaConsulta");
  busca.addEventListener("input", () => {
    const p = busca.value.toLowerCase();
    MostrarConsultas(
      listaConsultas.filter((c) =>
        (c.paciente_nome + " " + c.medico_nome).toLowerCase().includes(p)
      )
    );
  });

  try {
    await CarregarConsultas();
  } catch (erro) {
    MostrarErro("mensagemConsultas", erro);
  }
};

// Configura o formulário.
const IniciarFormConsulta = async () => {
  const form = document.getElementById("formConsulta");
  const id = form.dataset.id;
  const operacao = form.dataset.operacao;
  const seletor = document.getElementById("medico_id");

  try {
    const { registro: medicos } = await BuscarMedicos();
    seletor.add(new Option("Selecione um médico", ""));
    
    medicos.forEach((m) => {
      seletor.add(new Option(m.nome + " — " + m.crm, String(m.id)));
    });

    if (operacao !== "novo") {
      const { registro } = await GetConsultaByID(id);
      const c = registro[0];
      
      document.getElementById("idConsulta").value = c.id;
      document.getElementById("paciente_nome").value = c.paciente_nome;
      document.getElementById("data_consulta").value = c.data_consulta;
      document.getElementById("valor").value = Number(c.valor).toFixed(2);
      document.getElementById("realizada").checked = Boolean(c.realizada);

      if (![...seletor.options].some((o) => o.value === String(c.medico_id))) {
        seletor.add(new Option(c.medico_nome + " (removido)", String(c.medico_id)));
      }
      seletor.value = String(c.medico_id);
    }

    if (operacao === "visualizar") {
      form.querySelectorAll("input, select").forEach((elemento) => {
        elemento.disabled = true;
      });
      document.getElementById("salvarConsulta").classList.add("d-none");
    }
  } catch (erro) {
    MostrarErro("mensagemConsulta", erro);
    document.getElementById("salvarConsulta").disabled = true;
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (operacao === "visualizar") {
      return;
    }

    const dados = {
      paciente_nome: document.getElementById("paciente_nome").value.trim(),
      data_consulta: document.getElementById("data_consulta").value,
      valor: Number(document.getElementById("valor").value),
      realizada: document.getElementById("realizada").checked,
      medico_id: Number(seletor.value),
    };

    try {
      if (operacao === "novo") {
        await InsertConsulta(dados);
      } else {
        await UpdateConsulta(id, dados);
      }
      window.location.href = "/consultas";
    } catch (erro) {
      MostrarErro("mensagemConsulta", erro);
    }
  });
};

// Inicia o JavaScript da página aberta.
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("corpoConsultas")) {
    IniciarConsultas();
  }
  if (document.getElementById("formConsulta")) {
    IniciarFormConsulta();
  }
});
