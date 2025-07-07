// routes/scheduleRoutes.js
import { Router } from 'express';
import {
  createSchedule,
  getSchedulesByDoctor,
  updateSchedule,
  deleteSchedule
} from '../controllers/scheduleController.js';

const router = Router({ mergeParams: true });

// POST   /api/doctors/:doctorCedula/schedule
router.post('/', createSchedule);

// GET    /api/doctors/:doctorCedula/schedule
router.get('/', getSchedulesByDoctor);

// PUT    /api/doctors/:doctorCedula/schedule/:id
router.put('/:id', updateSchedule);

// DELETE /api/doctors/:doctorCedula/schedule/:id
router.delete('/:id', deleteSchedule);

export default router;
