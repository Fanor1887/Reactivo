import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  especialidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialty', // Referencia a la especialidad
  },
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
