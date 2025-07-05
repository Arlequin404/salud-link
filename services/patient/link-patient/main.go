package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Patient struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;unique"`
	Cedula    string    `gorm:"type:varchar(20);unique;not null"`
	Name      string    `gorm:"type:varchar(255);not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

var DB *gorm.DB

func initDB() {
	host := os.Getenv("POSTGRES_HOST")
	user := os.Getenv("POSTGRES_USER")
	pass := os.Getenv("POSTGRES_PASSWORD")
	dbname := os.Getenv("POSTGRES_DB")
	port := os.Getenv("POSTGRES_PORT")
	if port == "" {
		port = "5432"
	}
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		host, user, pass, dbname, port)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Error al conectar a la base de datos: %v", err)
	}
	DB = db
	log.Println("✅ Conexión a Postgres exitosa")
}

func main() {
	initDB()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8019"
	}
	r := gin.Default()
	r.POST("/api/patient/link", func(c *gin.Context) {
		var input struct {
			PatientID string `json:"patient_id" binding:"required"`
			UserID    string `json:"user_id" binding:"required"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		pid, err1 := uuid.Parse(input.PatientID)
		uid, err2 := uuid.Parse(input.UserID)
		if err1 != nil || err2 != nil {
			c.JSON(400, gin.H{"error": "UUID inválido"})
			return
		}
		var patient Patient
		if err := DB.First(&patient, "id = ?", pid).Error; err != nil {
			c.JSON(404, gin.H{"error": "Patient not found"})
			return
		}
		patient.UserID = uid
		patient.UpdatedAt = time.Now()
		DB.Save(&patient)
		c.JSON(200, gin.H{"message": "Patient linked"})
	})
	addr := fmt.Sprintf(":%s", port)
	log.Printf("🚀 link-patient running on %s\n", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("❌ failed to start server: %v", err)
	}
}
