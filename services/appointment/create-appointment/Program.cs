using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Models;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Permite fallback a appsettings.Development.json para desarrollo local
var connString = Environment.GetEnvironmentVariable("POSTGRES_CONNECTION") 
    ?? builder.Configuration.GetConnectionString("Postgres");

if (string.IsNullOrEmpty(connString))
    throw new Exception("No se encontró la variable de entorno POSTGRES_CONNECTION ni una cadena de conexión 'Postgres'.");

// Configura EF Core con Npgsql
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- Migración automática ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

// Endpoint para crear cita
app.MapPost("/api/appointment", async (AppointmentDto dto, AppDbContext db) =>
{
    // Fuerza la fecha a UTC
    var dateUtc = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc);

    var appointment = new Appointment
    {
        DoctorCedula = dto.DoctorCedula,
        PatientId = dto.PatientId,
        Date = dateUtc,
        SlotTime = dto.SlotTime,
        Notes = dto.Notes ?? "",
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    db.Appointments.Add(appointment);
    await db.SaveChangesAsync();
    return Results.Created($"/api/appointment/{appointment.Id}", new { appointment.Id, message = "Appointment created" });
});

app.Run();
