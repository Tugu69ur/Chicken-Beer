import Bandi from '../models/bandiModel.js';
// Create a new bandi
export const createBandi = async (req, res) => {
    try {
        const bandi = new Bandi(req.body);
        await bandi.save();
        res.status(201).json(bandi);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all bandis
export const getAllBandis = async (req, res) => {
    try {
        const bandis = await Bandi.find();
        res.status(200).json(bandis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a bandi by ID
export const getBandiById = async (req, res) => {
    try {
        const bandi = await Bandi.findById(req.params.id);
        if (!bandi) return res.status(404).json({ message: 'Bandi not found' });
        res.status(200).json(bandi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a bandi
export const updateBandi = async (req, res) => {
    try {
        const bandi = await Bandi.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bandi) return res.status(404).json({ message: 'Bandi not found' });
        res.status(200).json(bandi);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a bandi
export const deleteBandi = async (req, res) => {
    try {
        const bandi = await Bandi.findByIdAndDelete(req.params.id);
        if (!bandi) return res.status(404).json({ message: 'Bandi not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
