const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: String, required: true },
    time: { type: String, required: true },
    place: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    query: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consultation', ConsultationSchema);
