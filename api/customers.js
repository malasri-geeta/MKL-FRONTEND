import mongoose from 'mongoose';
import Customer from './_customerModel';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mkl', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default async function handler(req, res) {
  await connectDB();

  const { method, query, body } = req;

  // GET /api/customers/:id
  if (method === 'GET' && query.id) {
    try {
      const customer = await Customer.findById(query.id);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.status(200).json(customer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  // PUT /api/customers?id=xxx
  if (method === 'PUT' && query.id) {
    try {
      const customer = await Customer.findByIdAndUpdate(query.id, body, { new: true, runValidators: true });
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.status(200).json(customer);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }

  // PATCH /api/customers?id=xxx&terminate=true
  if (method === 'PATCH' && query.id && query.terminate) {
    try {
      const customer = await Customer.findByIdAndUpdate(query.id, { active: false }, { new: true });
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.status(200).json(customer);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }

  // GET /api/customers
  if (method === 'GET') {
    try {
      const customers = await Customer.find();
      res.status(200).json(customers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  // POST /api/customers
  if (method === 'POST') {
    try {
      const customer = new Customer(body);
      await customer.save();
      res.status(201).json(customer);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
