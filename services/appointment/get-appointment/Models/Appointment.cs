using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("appointments")]
public class Appointment
{
    [Key]
    public Guid Id { get; set; }
    public string DoctorCedula { get; set; }
    public string PatientId { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan SlotTime { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
