--Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    removido BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT pK_usuarios PRIMARY KEY (id)
);

--Criar extensão para criptografia de senha
CREATE EXTENSION IF NOT EXISTS pgcrypto;

--Inserir usuários para teste
INSERT INTO usuarios (username, password) VALUES
('user1', crypt('1234', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

--Criar tabela de médicos
CREATE TABLE IF NOT EXISTS medicos(
    id BIGSERIAL NOT NULL,
    nome VARCHAR(100) NOT NULL,
    crm VARCHAR(30) UNIQUE NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    removido BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT pK_medicos PRIMARY KEY (id)
);

--Criar tabela de consultas
CREATE TABLE IF NOT EXISTS consultas(
    id BIGSERIAL NOT NULL,
    paciente_nome VARCHAR(100) NOT NULL,
    data_consulta DATE NOT NULL,
    valor DECIMAL(10,2) NOT NULL CHECK (valor >= 0),
    realizada BOOLEAN NOT NULL DEFAULT FALSE,
    medico_id BIGINT NOT NULL,
    removido BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT pK_consultas PRIMARY KEY (id),
    CONSTRAINT fk_medico FOREIGN KEY (medico_id) REFERENCES medicos(id)
);