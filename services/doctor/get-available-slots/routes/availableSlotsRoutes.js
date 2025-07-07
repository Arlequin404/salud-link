import express from 'express';
import { getAvailableSlots } from '../controllers/availableSlotsController.js';

const router = express.Router();

// Ruta para obtener turnos disponibles
router.get('/:doctorCedula', getAvailableSlots);

export default router;
