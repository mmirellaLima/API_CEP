const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/cep/:cep", async (req, res) => {

    const cep = req.params.cep;

    try {

        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );

        const dados = await resposta.json();

        res.json(dados);

    } catch (erro) {

        res.status(500).json({
            erro: "Erro ao consultar o CEP"
        });

    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});