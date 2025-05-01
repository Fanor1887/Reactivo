const createItem = (Model) => async (req, res) => {
  try {
    const newItem = new Model(req.body);
    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error creando el elemento: ${error.message}` });
  }
};

const getAllItems =
  (Model, populateFields = []) =>
  async (req, res) => {
    try {
      const query = Model.find();

      if (populateFields.length > 0) {
        populateFields.forEach((field) => query.populate(field));
      }

      const items = await query;
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error obteniendo los elementos: ${error.message}` });
    }
  };

const getItemById = (Model) => async (req, res) => {
  try {
    const item = await Model.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Elemento no encontrado' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error obteniendo el elemento: ${error.message}` });
  }
};

const updateItem = (Model) => async (req, res) => {
  try {
    const updatedItem = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      return res
        .status(404)
        .json({ error: 'Elemento no encontrado para actualizar' });
    }
    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error actualizando el elemento: ${error.message}` });
  }
};

const deleteItem = (Model) => async (req, res) => {
  try {
    const deletedItem = await Model.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res
        .status(404)
        .json({ error: 'Elemento no encontrado para eliminar' });
    }
    res.status(200).json({ success: true, data: deletedItem });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error eliminando el elemento: ${error.message}` });
  }
};

export default {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
