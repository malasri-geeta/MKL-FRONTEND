import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  details: { type: String, required: true },
  purifier: { type: String, required: true },
  issue: { type: String },
  parts: { type: String },
  paymentMode: { type: String, default: 'cash' },
  amount: { type: String },
});

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String },
  address: { type: String },
  contact: { type: String },
  reminder: { type: String },
  reminderType: { type: String, default: '6months' },
  active: { type: Boolean, default: true },
  services: [ServiceSchema],
});

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;
