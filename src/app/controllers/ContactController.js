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
}

export default new ContactController();
