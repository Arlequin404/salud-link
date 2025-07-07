using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Intenta leer cadena de conexión de variable de entorno
var connString = Environment.GetEnvironmentVariable("POSTGRES_CONNECTION");

// 2. Si no existe, intenta leer de appsettings.json para uso local
if (string.IsNullOrEmpty(connString))
    connString = builder.Configuration.GetConnectionString("Postgres");

// 3. Si sigue vacía, lanza excepción
if (string.IsNullOrEmpty(connString))
    throw new Exception("POSTGRES_CONNECTION environment variable or ConnectionStrings:Postgres in appsettings.json not set");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Migración automática (siempre la mantiene actualizada)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseSwagger();
app.UseSwaggerUI();

// Endpoint para obtener cita por ID
app.MapGet("/api/appointment/{id}", async (Guid id, AppDbContext db) =>
{
    var appointment = await db.Appointments.FindAsync(id);
    if (appointment == null)
        return Results.NotFound(new { message = "Appointment not found" });

    return Results.Ok(appointment);
});

app.Run();
