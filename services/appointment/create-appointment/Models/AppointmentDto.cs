using System;
namespace Models;

public record AppointmentDto(
    string DoctorCedula,
    string PatientId,           // UUID del paciente (string)
    DateTime Date,              // Fecha de la cita (en UTC)
    TimeSpan SlotTime,          // Hora del slot
    string? Notes               // Nota opcional
);
