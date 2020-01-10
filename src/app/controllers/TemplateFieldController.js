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

  async store(req, res) {
    try {
      const { name, id_dominio } = req.body;
      const TemplateField = await TemplateFields.findOne({
        where: {
          nome_campo: name,
          fk_id_dominio: id_dominio,
        },
      });

      if (TemplateField) {
        return res.status(400).json({ error: 'Campo já existe' });
      }

      const created = await TemplateFields.create({
        nome_campo: name,
        fk_id_dominio: id_dominio,
      });

      return res.json(created);
    } catch (error) {
      return res
        .json(500)
        .json({ error: 'Erro ao adicionar campo de template' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const contactField = await TemplateFields.findByPk(id);

      if (!contactField) {
        res.status(404).json({ error: 'Campo não encontrados' });
      }

      await contactField.destroy();

      res.json({ message: `Campo ${contactField.nome_campo} deletado` });
    } catch (error) {
      res.status(400).json({ error: 'Erro ao deletar campo do template' });
    }
  }
}

export default new TemplateFieldController();
