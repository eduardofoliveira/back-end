import Sequelize, { Model } from 'sequelize';

class TemplateFields extends Model {
  static init(sequelize) {
    super.init(
      {
        nome_campo: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'template_agenda',
        timestamps: false,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Domain, { foreignKey: 'fk_id_dominio' });
  }
}

export default TemplateFields;
