import Sequelize, { Model } from 'sequelize';

class Ticket extends Model {
  static init(sequelize) {
    super.init(
      {
        de: Sequelize.STRING,
        para: Sequelize.STRING,
        comentario: Sequelize.STRING,
        inicio: Sequelize.DATE,
        termino: Sequelize.DATE,
        call_id: Sequelize.STRING,
        aberto: Sequelize.TINYINT,
      },
      {
        sequelize,
        tableName: 'chamado',
        timestamps: false,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Domain, { foreignKey: 'fk_id_dominio' });
    this.belongsTo(models.User, { foreignKey: 'fk_id_usuario', as: 'usuario' });
    this.belongsTo(models.User, {
      foreignKey: 'fk_fechado_por',
      as: 'fechado',
    });
  }
}

export default Ticket;
