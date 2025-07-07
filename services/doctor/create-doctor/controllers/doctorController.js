import { Doctor } from '../models/index.js';

export const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getDoctor = async (req, res) => {
  try {
    const { cedula } = req.params;
    const doctor = await Doctor.findOne({ where: { cedula } });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { cedula } = req.params;
    const [updated] = await Doctor.update(req.body, { where: { cedula } });
    if (!updated) return res.status(404).json({ error: 'Doctor not found' });
    const updatedDoctor = await Doctor.findOne({ where: { cedula } });
    res.json(updatedDoctor);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { cedula } = req.params;
    const deleted = await Doctor.destroy({ where: { cedula } });
    if (!deleted) return res.status(404).json({ error: 'Doctor not found' });
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
