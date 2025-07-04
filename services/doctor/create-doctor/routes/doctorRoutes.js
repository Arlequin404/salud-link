import { Router } from 'express';
import {
  createDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor
} from '../controllers/doctorController.js';

const router = Router();

router.post('/', createDoctor);           // POST   /api/doctor
router.get('/:cedula', getDoctor);        // GET    /api/doctor/:cedula
router.put('/:cedula', updateDoctor);     // PUT    /api/doctor/:cedula
router.delete('/:cedula', deleteDoctor);  // DELETE /api/doctor/:cedula

export default router;
