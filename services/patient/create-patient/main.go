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
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		host, user, pass, dbname, port,
	)
	log.Printf("🔍 Conectando a Postgres con DSN: %s", dsn)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Error al conectar a la base de datos: %v", err)
	}
	DB = db

	// Extensión para UUID y migración SOLO aquí
	if err := DB.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`).Error; err != nil {
		log.Fatalf("❌ Error al crear extensión uuid-ossp: %v", err)
	}
	if err := DB.AutoMigrate(&Patient{}); err != nil {
		log.Fatalf("❌ Error en AutoMigrate Patient: %v", err)
	}
	log.Println("✅ AutoMigrate Patient exitoso")
}

func main() {
	initDB()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8014"
	}

	r := gin.Default()
	r.POST("/api/patient", func(c *gin.Context) {
		var input struct {
			UserID string `json:"user_id" binding:"required"`
			Cedula string `json:"cedula" binding:"required"`
			Name   string `json:"name" binding:"required"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		uid, err := uuid.Parse(input.UserID)
		if err != nil {
			c.JSON(400, gin.H{"error": "user_id inválido"})
			return
		}
		patient := Patient{
			UserID:    uid,
			Cedula:    input.Cedula,
			Name:      input.Name,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		if err := DB.Create(&patient).Error; err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, gin.H{"message": "Patient created", "patient_id": patient.ID})
	})

	addr := fmt.Sprintf(":%s", port)
	log.Printf("🚀 create-patient running on %s\n", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("❌ failed to start server: %v", err)
	}
}
