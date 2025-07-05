import { DoctorSchedule } from '../models/schedule.js';
import { getAppointmentsForDoctorOnDate } from '../utils/appointments.js';
import { generateTimeSlots } from '../utils/slotGenerator.js';

export const getAvailableSlots = async (req, res) => {
  const { doctorCedula } = req.params;
  const { date } = req.query;

  console.log('📥 Recibida solicitud para:', doctorCedula, 'en', date);

  if (!date) return res.status(400).json({ error: 'Missing date parameter' });

  try {
    const schedules = await DoctorSchedule.findAll({ where: { doctor_cedula: doctorCedula } });

    if (!schedules.length) {
      console.warn(`⚠️ No hay horarios registrados para ${doctorCedula}`);
      return res.status(404).json({ error: 'No schedule found for doctor' });
    }

    const appointments = await getAppointmentsForDoctorOnDate(doctorCedula, date);
    const slots = generateTimeSlots(schedules, date, appointments);

    return res.json({ available_slots: slots });
  } catch (error) {
    console.error('❌ Error interno en getAvailableSlots:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
