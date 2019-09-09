import Sequelize from 'sequelize';

import Domain from '../app/models/Domain';

import databaseConfig from '../config/database';

const models = [Domain];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
