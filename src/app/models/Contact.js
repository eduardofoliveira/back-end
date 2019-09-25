import Sequelize, { Model } from 'sequelize';

class Contact extends Model {
  static init(sequelize) {
    super.init(
      {
        did: Sequelize.STRING,
        descricao: Sequelize.STRING,
        fraseologia: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'agenda',
        timestamps: false,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Domain, { foreignKey: 'fk_id_dominio' });
    this.hasMany(models.ContactFields, {
      foreignKey: 'fk_id_agenda',
      sourceKey: 'id',
    });
  }
}

export default Contact;
