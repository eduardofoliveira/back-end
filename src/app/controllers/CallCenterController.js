import {
  login,
  logout,
  obterPausas,
  entrarEmPausa,
  sairDaPausa,
} from '../../service/api-basix';

class CallCenterController {
  async login(req, res) {
    try {
      const { user, domain } = req.body;
      await login({ user, domain });
      res.json({ message: 'Login efetuado' });
    } catch (error) {
      res.status(400).json({ error: 'Falha ao efetuar login' });
    }
  }

  async logout(req, res) {
    try {
      const { user, domain } = req.body;
      await logout({ user, domain });
      res.json({ message: 'Logout efetuado' });
    } catch (error) {
      res.status(400).json({ error: 'Falha ao efetuar logout' });
    }
  }

  async pausas(req, res) {
    try {
      const { domain, group } = req.body;
      const data = await obterPausas({ domain, group });
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: 'Falha ao buscar pausas' });
    }
  }

  async entrarPausa(req, res) {
    try {
      const { user, domain, cod } = req.body;
      await entrarEmPausa({ user, domain, cod });
      res.json({ message: 'Pausa ativa' });
    } catch (error) {
      res.status(400).json({ error: 'Falha ao entrar em pausa' });
    }
  }

  async SairPausa(req, res) {
    try {
      const { user, domain } = req.body;
      await sairDaPausa({ user, domain });
      res.json({ message: 'Disponivel' });
    } catch (error) {
      res.status(400).json({ error: 'Falha ao sair da pausa' });
    }
  }
}

export default new CallCenterController();
