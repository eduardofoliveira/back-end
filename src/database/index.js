import Sequelize from 'sequelize';

import Domain from '../app/models/Domain';
import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [Domain, User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
