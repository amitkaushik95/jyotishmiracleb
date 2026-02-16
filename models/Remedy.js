const mongoose = require('mongoose');

const RemedySchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    dob: { type: String },
    remedies: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Remedy', RemedySchema);
