const axios = require('axios');

const api = axios.create({
  baseURL: 'http://login.cloudcom.com.br/basix/webservices/callcenter',
  auth: {
    username: 'eoliveira@centrex.brastel.com.br',
    password: '190790edu',
  },
});

const login = ({ user, domain }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.get(`login/${user}/${domain}/1`);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

const logout = ({ user, domain }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.get(`login/${user}/${domain}/-1`);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

const obterPausas = ({ domain, group }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.get(`getpausecodes/${domain}/${group}`);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

const entrarEmPausa = ({ user, domain, cod }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.get(`pause/${user}/${domain}/${cod}`);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

const sairDaPausa = ({ user, domain }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.get(`pause/${user}/${domain}/-1`);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  login,
  logout,
  obterPausas,
  entrarEmPausa,
  sairDaPausa,
};

// const executar = async () => {
//   const result = await login({
//     user: 'Eduardo',
//     domain: 'cloud.cloudcom.com.br',
//   });

//   const result = await logout({
//     user: 'Eduardo',
//     domain: 'cloud.cloudcom.com.br',
//   });

//   const result = await obterPausas({
//     domain: 'cloud.cloudcom.com.br',
//     group: 'Cloud_CallCenter',
//   });

//   const result = await entrarEmPausa({
//     user: 'Eduardo',
//     domain: 'cloud.cloudcom.com.br',
//     cod: 12,
//   });

//   const result = await sairDaPausa({
//     user: 'Eduardo',
//     domain: 'cloud.cloudcom.com.br',
//   });

//   console.log(result);
// };

// executar();
