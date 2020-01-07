import TemplateFields from '../models/TemplateFields';

class TemplateFieldController {
  async show(req, res) {
    try {
      const { id } = req.params;
      const contactField = await TemplateFields.findAll({
        where: {
          fk_id_dominio: id,
        },
      });

      if (!contactField) {
        res.status(404).json({ error: 'Campos não encontrados' });
      }

      res.json(contactField);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao buscar campos padrão' });
    }
  }
}

export default new TemplateFieldController();
