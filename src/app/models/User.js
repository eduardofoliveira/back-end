import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        ativo: Sequelize.TINYINT,
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        senha: Sequelize.STRING,
        callcenter_group: Sequelize.STRING,
        user_basix: Sequelize.STRING,
        tipo: Sequelize.TINYINT,
        loginlogout: Sequelize.TINYINT,
        gravacao: Sequelize.TINYINT,
        descricao: Sequelize.STRING,
        ativo_dendron: Sequelize.TINYINT,
        dendron_operador: Sequelize.STRING,
        dendron_token: Sequelize.STRING,
        ativo_zendesk: Sequelize.TINYINT,
        email_zendesk: Sequelize.STRING,
        token_zendesk: Sequelize.STRING,
        sub_dominio_zendesk: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'usuario',
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.senha.length < 56) {
        user.senha = await bcrypt.hash(user.senha, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.senha);
  }

  static associate(models) {
    this.belongsTo(models.Domain, { foreignKey: 'fk_id_dominio' });
  }
}

export default User;
