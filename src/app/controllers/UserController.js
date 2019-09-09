import User from '../models/User';

class UserController {
  async show(req, res) {
    const { domain } = req.params;

    const users = await User.findAll({
      where: { fk_id_dominio: domain },
      attributes: [
        'id',
        'ativo',
        'nome',
        'user_basix',
        'descricao',
        'ativo_dendron',
        'ativo_zendesk',
      ],
    });

    return res.json(users);
  }

  async index(req, res) {
    const { domain, id } = req.params;

    const user = await User.findOne({
      where: {
        id,
        fk_id_dominio: domain,
      },
      attributes: { exclude: ['senha', 'createdAt', 'updatedAt'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  }

  async store(req, res) {
    const { email } = req.body;
    const userExists = await User.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already Exists' });
    }

    req.body.fk_id_dominio = req.params.domain;

    const user = await User.create(req.body);

    return res.json(user);
  }

  async update(req, res) {
    const { domain, id } = req.params;
    const user = await User.findOne({
      where: {
        id,
        fk_id_dominio: domain,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }

    await user.update(req.body);

    const userUpdated = await User.findOne({
      where: {
        id,
      },
      attributes: { exclude: ['senha', 'createdAt', 'updatedAt'] },
    });

    return res.json(userUpdated);
  }

  async delete(req, res) {
    const { domain, id } = req.params;
    const userExists = await User.findOne({
      where: {
        id,
        fk_id_dominio: domain,
      },
    });

    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      await userExists.destroy();
      return res.json({ message: 'User deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Server Internal Error' });
    }
  }
}

export default new UserController();
