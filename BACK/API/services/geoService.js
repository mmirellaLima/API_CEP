// BACK/API/services/geoService.js
const axios = require('axios');

async function consultarViaCEP(cep) {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) {
    throw new Error('CEP inválido.');
  }
  
  const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  if (response.data.erro) {
    throw new Error('CEP não encontrado.');
  }
  
  return response.data;
}

async function obterCoordenadas(enderecoCompleto) {
  const encodedAddress = encodeURIComponent(enderecoCompleto);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;
  
  const response = await axios.get(url, {
    headers: { 'User-Agent': 'SeuAppOcorrencias' }
  });

  if (!response.data || response.data.length === 0) {
    throw new Error('Não foi possível geocodificar o endereço.');
  }

  return {
    lat: parseFloat(response.data[0].lat),
    lon: parseFloat(response.data[0].lon)
  };
}

module.exports = {
  consultarViaCEP,
  obterCoordenadas
};