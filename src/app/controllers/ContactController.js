import Sequelize from 'sequelize';
import Contact from '../models/Contact';
import ContactFields from '../models/ContactFields';

const { Op } = Sequelize;

class ContactController {
  async show(req, res) {
    const { page = 0 } = req.query;
    let { did, descricao } = req.query;
    const offset = parseInt(page * 50, 10);

    if (!did) {
      did = { [Op.like]: '%' };
    } else {
      did = { [Op.like]: `%${did}%` };
    }

    if (!descricao) {
      descricao = { [Op.like]: '%' };
    } else {
      descricao = { [Op.like]: `%${descricao}%` };
    }

    const contacts = await Contact.findAndCountAll({
      where: {
        fk_id_dominio: req.user.id_dominio,
        did,
        descricao,
      },
      include: [ContactFields],
      limit: 50,
      offset,
    });

    res.json(contacts);
  }

  async index(req, res) {
    const { id } = req.params;

    const contact = await Contact.findOne({
      where: {
        fk_id_dominio: req.user.id_dominio,
        id,
      },
      include: [ContactFields],
    });

    if (contact) {
      return res.json(contact);
    }

    return res.status(404).json({ error: 'Contato não encontrado' });
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const contact = await Contact.findByPk(id);

      if (!contact) {
        return res.status(404).json({ error: 'Contato não encontrado' });
      }

      const result = req.body.ContactFields.map(async field => {
        if (field.id) {
          const itemField = await ContactFields.findOne({
            where: { id: field.id },
          });
          await itemField.update(field);
        } else {
          await ContactFields.create({ ...field, fk_id_agenda: req.body.id });
        }
      });

      await Promise.all(result);

      await contact.update(req.body);

      const contactUpdated = await Contact.findOne({
        where: {
          fk_id_dominio: req.user.id_dominio,
          id,
        },
        include: [ContactFields],
      });

      return res.json(contactUpdated);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar contato' });
    }
  }

  async store(req, res) {
    try {
      const { did } = req.body;
      const contact = await Contact.findOne({
        where: {
          did,
          fk_id_dominio: req.user.id_dominio,
        },
      });

      if (!contact) {
        const contactCreated = await Contact.create({
          ...req.body,
          fk_id_dominio: req.user.id_dominio,
        });

        const result = req.body.ContactFields.map(async field => {
          await ContactFields.create({
            ...field,
            fk_id_agenda: contactCreated.id,
          });
        });

        await Promise.all(result);

        const FullContact = await Contact.findOne({
          where: {
            fk_id_dominio: req.user.id_dominio,
            id: contactCreated.id,
          },
          include: [ContactFields],
        });

        return res.send(FullContact);
      }
      return res.status(400).json({ error: 'Contato já existe' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao inserir contato' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const contact = await Contact.findByPk(id);

      if (!contact) {
        return res.status(404).json({ error: 'Contato não encontrado' });
      }

      await ContactFields.destroy({
        where: {
          fk_id_agenda: contact.id,
        },
      });

      await contact.destroy();

      return res.json({ message: 'Contato removido' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao deletar contato' });
    }
  }
}

export default new ContactController();
