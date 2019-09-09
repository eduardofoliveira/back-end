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

    const { id, user_basix } = user;

    return res.json({
      user: {
        id,
        email,
        user_basix,
      },
      token: jwt.sign({ id, user_basix }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
