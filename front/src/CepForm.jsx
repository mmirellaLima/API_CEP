import { useState } from "react";
import "./CepForm.css";

const CAMPOS_INICIAIS = {
  rua: "",
  bairro: "",
  cidade: "",
  estado: "",
};

export default function CepForm() {
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState(CAMPOS_INICIAIS);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [encontrado, setEncontrado] = useState(false);

  const cepLimpo = cep.replace(/\D/g, "");
  const cepValido = cepLimpo.length === 8;

  function formatarCep(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);
    if (numeros.length <= 5) return numeros;
    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
  }

  function handleCepChange(e) {
    setCep(formatarCep(e.target.value));
    if (erro) setErro(null);
  }

  function handleCampoChange(campo, valor) {
    setEndereco((atual) => ({ ...atual, [campo]: valor }));
  }

  async function buscarCep() {
    if (!cepValido) {
      setErro("Digite um CEP válido com 8 dígitos.");
      return;
    }

    setCarregando(true);
    setErro(null);
    setEncontrado(false);

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

      if (!resposta.ok) {
        throw new Error("Falha na comunicação com o servidor.");
      }

      const dados = await resposta.json();

      if (dados.erro) {
        setErro("CEP não encontrado. Verifique o número digitado.");
        setEndereco(CAMPOS_INICIAIS);
        return;
      }

      setEndereco({
        rua: dados.logradouro || "",
        bairro: dados.bairro || "",
        cidade: dados.localidade || "",
        estado: dados.uf || "",
      });
      setEncontrado(true);
    } catch {
      setErro("Não foi possível consultar o CEP agora. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    buscarCep();
  }

  return (
    <div className="cep-pagina">
      <div className="cep-cartao">
        <header className="cep-cabecalho">
          <span className="cep-selo">Consulta de endereço</span>
          <h1 className="cep-titulo">Qual é o seu CEP?</h1>
          <p className="cep-subtitulo">
            Informe o CEP e preenchemos o resto do endereço para você.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="cep-formulario" noValidate>
          <div className="cep-linha-busca">
            <input
              type="text"
              inputMode="numeric"
              value={cep}
              onChange={handleCepChange}
              placeholder="00000-000"
              aria-label="CEP"
              className="cep-input-cep"
            />
            <button
              type="submit"
              disabled={!cepValido || carregando}
              className="cep-botao"
            >
              {carregando ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {erro && (
            <p role="alert" className="cep-erro">
              {erro}
            </p>
          )}

          <div className="cep-grade">
            <Campo
              label="Rua"
              valor={endereco.rua}
              onChange={(v) => handleCampoChange("rua", v)}
              largo
            />
            <Campo
              label="Bairro"
              valor={endereco.bairro}
              onChange={(v) => handleCampoChange("bairro", v)}
            />
            <Campo
              label="Cidade"
              valor={endereco.cidade}
              onChange={(v) => handleCampoChange("cidade", v)}
            />
            <Campo
              label="Estado"
              valor={endereco.estado}
              onChange={(v) => handleCampoChange("estado", v)}
            />
          </div>

          {encontrado && (
            <p className="cep-confirmacao">
              Endereço encontrado. Revise os campos antes de continuar.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function Campo({ label, valor, onChange, largo }) {
  return (
    <label className={`cep-campo-wrapper ${largo ? "cep-campo-largo" : ""}`}>
      <span className="cep-campo-label">{label}</span>
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        className="cep-campo-input"
      />
    </label>
  );
}