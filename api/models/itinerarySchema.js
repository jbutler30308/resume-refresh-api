// models/itinerarySchema.js

const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  destination: { type: String, required: true }, // meta.destination
  dates: { type: String, required: true },       // meta.dates
  name: { type: String, default: '' },           // user-supplied
  history: {
    meta: { type: Object, required: true },
    report: { type: String, required: true },
    categories: { type: Object, required: true },
    contacts: { type: Array, default: [] }       // renamed from top_contacts_vcards
  },
  createdAt: { type: Date, default: Date.now }
});

// Compound index for uniqueness
itinerarySchema.index({ destination: 1, dates: 1, name: 1 }, { unique: true });

module.exports = itinerarySchema;
