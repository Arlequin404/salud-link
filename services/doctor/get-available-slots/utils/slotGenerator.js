import dayjs from 'dayjs';

export const generateTimeSlots = (scheduleList, dateStr, appointmentsTaken) => {
  try {
    console.log('🧪 Entrando a generateTimeSlots');
    console.log('📆 Fecha recibida:', dateStr);
    console.log('📋 Schedules:', scheduleList);
    console.log('📌 Citas ocupadas:', appointmentsTaken);

    const jsDay = dayjs(dateStr).day() === 0 ? 7 : dayjs(dateStr).day();
    const taken = appointmentsTaken.map(a => a.time);
    const slots = [];

    for (const schedule of scheduleList) {
      const scheduleDay = parseInt(schedule.day_of_week);
      console.log(`🔎 Comparando día: schedule(${scheduleDay}) vs date(${jsDay})`);

      if (scheduleDay !== jsDay) continue;

      const duration = schedule.slot_duration_minutes || 30;
      if (!schedule.start_time || !schedule.end_time) {
        console.warn('⚠️ Turno inválido detectado:', schedule);
        continue;
      }

      let current = dayjs(`${dateStr} ${schedule.start_time}`);
      const end = dayjs(`${dateStr} ${schedule.end_time}`);

      while (current.add(duration, 'minute').isBefore(end) || current.add(duration, 'minute').isSame(end)) {
        const slot = current.format('HH:mm');
        if (!taken.includes(slot)) {
          slots.push(slot);
        }
        current = current.add(duration, 'minute');
      }
    }

    console.log('✅ Turnos generados:', slots);
    return slots;
  } catch (err) {
    console.error('💥 Error dentro de generateTimeSlots:', err);
    throw err;
  }
};
