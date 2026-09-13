const formulario = document.getElementById('formulario');

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const cep = document.getElementById('cep').value;

    if(cep.length !== 8) {
        alert("CEP inválido. Por favor, insira um CEP com 8 dígitos.");
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(resposta => resposta.json())
        .then(dados => {

            document.getElementById('Rua').value = dados.logradouro;
            document.getElementById('Bairro').value = dados.bairro;
            document.getElementById('Cidade').value = dados.localidade;
            document.getElementById('UF').value = dados.uf;
            
        })
        .catch(erro => {
            console.error("Erro:", erro);
            alert("Ocorreu um erro ao buscar o CEP. Por favor, tente novamente.");
        });
});
