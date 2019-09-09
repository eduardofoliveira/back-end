import Sequelize, { Model } from 'sequelize';

class Domain extends Model {
  static init(sequelize) {
    super.init(
      {
        dominio: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'dominio',
        timestamps: false,
      }
    );
  }
}

export default Domain;
