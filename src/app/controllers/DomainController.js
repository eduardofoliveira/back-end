import Domain from '../models/Domain';

class DomainController {
  async show(req, res) {
    const domains = await Domain.findAll();

    return res.json(domains);
  }

  async index(req, res) {
    const { id } = req.params;
    const domain = await Domain.findByPk(id);

    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    return res.json(domain);
  }

  async store(req, res) {
    const { dominio } = req.body;
    const domainExists = await Domain.findOne({ where: { dominio } });

    if (domainExists) {
      return res.status(400).json({ error: 'Domain already exists' });
    }

    const domain = await Domain.create(req.body);

    return res.json(domain);
  }

  async update(req, res) {
    const { id } = req.params;
    const domain = await Domain.findByPk(id);

    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    await domain.update(req.body);

    const { dominio } = await Domain.findByPk(id);

    return res.json({ id, dominio });
  }

  async delete(req, res) {
    const { id } = req.params;
    const domainExists = await Domain.findByPk(id);

    if (!domainExists) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    try {
      await domainExists.destroy();
      return res.json({ message: 'Domain deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Server Internal Error' });
    }
  }
}

export default new DomainController();
