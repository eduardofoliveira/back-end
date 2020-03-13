import jwt from 'jsonwebtoken';
import User from '../models/User';
import Domain from '../models/Domain';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, senha } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(senha))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const {
      id,
      nome,
      user_basix,
      callcenter_group,
      loginlogout,
      historico,
      fk_id_dominio: id_dominio,
      tipo,
    } = user;
    const { dominio } = await Domain.findOne({ where: { id: id_dominio } });

    return res.json({
      user: {
        id,
        nome,
        email,
        user_basix,
        callcenter_group,
        loginlogout,
        historico,
        id_dominio,
        dominio,
        tipo,
      },
      token: jwt.sign({ id, user_basix, id_dominio, tipo }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
