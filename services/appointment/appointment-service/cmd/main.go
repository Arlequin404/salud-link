package main

import (
    "database/sql"
    "fmt"
    "log"
    "net/http"
    "os"

    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
    _ "github.com/lib/pq"
)

type Appointment struct {
    ID           int    `json:"id"`
    PatientID    string `json:"patient_id"`
    DoctorCedula string `json:"doctor_cedula"`
    Date         string `json:"date"`
    StartTime    string `json:"start_time"`
    EndTime      string `json:"end_time"`
    Status       string `json:"status"`
}

func main() {
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }

    dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
        os.Getenv("POSTGRES_USER"),
        os.Getenv("POSTGRES_PASSWORD"),
        os.Getenv("POSTGRES_HOST"),
        os.Getenv("POSTGRES_PORT"),
        os.Getenv("POSTGRES_DB"),
    )

    db, err := sql.Open("postgres", dsn)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    if err := db.Ping(); err != nil {
        log.Fatal(err)
    }

    // Create appointments table if it doesn't exist
    _, err = db.Exec(`CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(50) NOT NULL,
        doctor_cedula VARCHAR(20) NOT NULL,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending'
    );`)
    if err != nil {
        log.Fatal(err)
    }

    r := gin.Default()
    r.GET("/health", func(c *gin.Context) {
        c.String(http.StatusOK, "ok")
    })

    r.POST("/api/appointments", func(c *gin.Context) {
        var a Appointment
        if err := c.ShouldBindJSON(&a); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        query := ` + "`" + `INSERT INTO appointments(patient_id, doctor_cedula, date, start_time, end_time, status)
            VALUES($1,$2,$3,$4,$5,$6) RETURNING id` + "`" + `
        err := db.QueryRow(query, a.PatientID, a.DoctorCedula, a.Date, a.StartTime, a.EndTime, a.Status).Scan(&a.ID)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusCreated, a)
    })

    port := os.Getenv("PORT")
    if port == "" {
        port = "8011"
    }
    r.Run(":" + port)
}
