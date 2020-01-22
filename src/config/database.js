module.exports = {
  dialect: 'mariadb',
  host: '35.171.122.245',
  socketPath: '/var/run/mysqld/mysqld.sock',
  username: 'popup',
  password: 'B@lpha9001',
  database: 'popup',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  pool: {
    max: 5,
    min: 1,
    acquire: 30000,
    idle: 10000,
  },
};
