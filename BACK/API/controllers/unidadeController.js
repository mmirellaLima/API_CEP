
const { consultarViaCEP, obterCoordenadas } = require('../services/geoService');
const unidadeRepository = require('../database/unidadeRepository');

async function cadastrarUnidade(req, res) {
  try {
    const { nome, cep, numero, complemento, equipeDisponivel } = req.body;

    const dadosCep = await consultarViaCEP(cep);
    
    const enderecoCompleto = `${dadosCep.logradouro}, ${numero || ''}, ${dadosCep.bairro}, ${dadosCep.localidade} - ${dadosCep.uf}, ${cep}`;
    
    const { lat, lon } = await obterCoordenadas(enderecoCompleto);

    const novaUnidade = {
      nome,
      cep: dadosCep.cep,
      logradouro: dadosCep.logradouro,
      bairro: dadosCep.bairro,
      cidade: dadosCep.localidade,
      estado: dadosCep.uf,
      numero,
      complemento,
      latitude: lat,
      longitude: lon,
      equipeDisponivel
    };

    const resultado = await unidadeRepository.salvarUnidade(novaUnidade);

    return res.status(201).json({
      message: 'Unidade cadastrada com sucesso!',
      unidade: resultado
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  cadastrarUnidade
};