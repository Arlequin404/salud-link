# get-appointment microservice

- .NET 8, EF Core, PostgreSQL
- Devuelve detalles de una cita por ID
- Variable de entorno: `POSTGRES_CONNECTION`
- Puerto: 8021

## Endpoints

- `GET /api/appointment/{id}`

## Ejemplo de respuesta
```json
{
  "id": "cfa78b8e-f01f-44d5-80c6-4ea110bcc08f",
  "doctorCedula": "1234567777",
  "patientId": "fda0aa14-0555-4c49-b851-816d554501ba",
  "date": "2025-07-08T00:00:00Z",
  "slotTime": "09:30:00",
  "notes": "Consulta por control anual",
  "createdAt": "2025-07-06T04:11:22.123Z",
  "updatedAt": "2025-07-06T04:11:22.123Z"
}
