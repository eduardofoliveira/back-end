import jwt from 'jsonwebtoken';
import User from '../models/User';
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

    const { id, nome, user_basix, fk_id_dominio: id_dominio, tipo } = user;

    return res.json({
      user: {
        id,
        nome,
        email,
        user_basix,
        id_dominio,
        tipo,
      },
      token: jwt.sign({ id, user_basix }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
