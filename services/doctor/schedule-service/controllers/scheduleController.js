// controllers/scheduleController.js
import DoctorSchedule from '../models/schedule.js';

export const createSchedule = async (req, res) => {
  try {
    const { day_of_week, start_time, end_time } = req.body;
    const { doctorCedula } = req.params;
    const schedule = await DoctorSchedule.create({
      doctor_cedula: doctorCedula,
      day_of_week,
      start_time,
      end_time
    });
    res.status(201).json(schedule);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getSchedulesByDoctor = async (req, res) => {
  try {
    const { doctorCedula } = req.params;
    const schedules = await DoctorSchedule.findAll({
      where: { doctor_cedula: doctorCedula }
    });
    res.json(schedules);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await DoctorSchedule.update(req.body, {
      where: { schedule_id: id }
    });
    if (!updated) return res.status(404).json({ error: 'Schedule not found' });
    res.json(await DoctorSchedule.findByPk(id));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DoctorSchedule.destroy({ where: { schedule_id: id } });
    if (!deleted) return res.status(404).json({ error: 'Schedule not found' });
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
