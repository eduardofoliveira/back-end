import Sequelize, { Model } from 'sequelize';

class ContactFields extends Model {
  static init(sequelize) {
    super.init(
      {
        nome_campo: Sequelize.STRING,
        conteudo: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'campos_agenda',
        timestamps: false,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Contact, { foreignKey: 'fk_id_agenda' });
  }
}

export default ContactFields;
