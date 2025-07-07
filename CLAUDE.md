# CodeViz Research Context

> **Note**: This file contains research context from CodeViz. Most recent contexts are at the bottom.

---

## Research Query

el de mi proyecto actual

*Session: 769260a0e8cdc6175dba37807f650e7c | Generated: 7/6/2025, 2:42:38 PM*

### Analysis Summary

# Salud-Link Project Overview

The Salud-Link project is a microservices-based application designed to manage health-related services, including appointments, doctor information, patient records, and user authentication. It comprises several distinct services, a frontend application, an API Gateway, and infrastructure/observability components.

## High-Level Architecture

The system is structured around a set of independent microservices that communicate primarily through an **API Gateway**. The **Frontend** application interacts with these services via the API Gateway. **Observability** components are in place for monitoring and logging, and **Terraform** is used for infrastructure management. Deployment workflows are defined in **GitHub Actions**.

### Core Components and Relationships

*   **Frontend** [frontend/](frontend/) serves the user interface. It interacts with the backend services through the **API Gateway**.
*   **API Gateway** [api-gateway/](api-gateway/) acts as a single entry point for all client requests, routing them to the appropriate backend services.
*   **Services** [services/](services/) directory contains various microservices, each responsible for a specific domain. These services are the core business logic of the application.
*   **Observability** [observability/](observability/) provides monitoring and logging capabilities for the entire system.
*   **Terraform** [terraform/](terraform/) manages the cloud infrastructure.
*   **GitHub Workflows** [.github/workflows/](.github/workflows/) define the continuous deployment pipelines for different parts of the application.
*   **Docker Compose** files (`docker-compose.yml`, `docker-compose.frontend.yml`, `docker-compose.infra.yml`, `docker-compose.user.yml`) orchestrate the deployment of these services.

## Detailed Component Breakdown

### API Gateway

The **API Gateway** [api-gateway/](api-gateway/) is a placeholder for the component that would handle request routing, authentication, and other cross-cutting concerns before forwarding requests to the appropriate microservice. Its current state is indicated by a `.keep` file [api-gateway/.keep](api-gateway/.keep).

### Frontend

The **Frontend** [frontend/](frontend/) is a web application that provides the user interface for interacting with the Salud-Link system.

*   **Purpose:** To present information to users and allow them to interact with the backend services.
*   **Internal Parts:**
    *   **CSS:** [frontend/css/style.css](frontend/css/style.css) for styling.
    *   **JavaScript:** [frontend/js/main.js](frontend/js/main.js) for general client-side logic, with specific modules for doctors [frontend/js/doctor/index.js](frontend/js/doctor/index.js) and users [frontend/js/user/index.js](frontend/js/user/index.js).
    *   **Views:** HTML files for different pages like doctor dashboard [frontend/views/doctor.html](frontend/views/doctor.html), home [frontend/views/home.html](frontend/views/home.html), login [frontend/views/login.html](frontend/views/login.html), and user dashboard [frontend/views/user.html](frontend/views/user.html).
*   **External Relationships:** Communicates with the backend services, presumably through the API Gateway, to fetch and send data.

### Services

The **services** directory [services/](services/) contains various microservices, each handling a specific domain.

#### Appointment Service

The **Appointment Service** [services/appointment/](services/appointment/) manages all operations related to appointments.

*   **Purpose:** To handle the creation, retrieval, updating, and deletion of appointments.
*   **Internal Parts:**
    *   `appointment-service/`: A Go-based service [services/appointment/appointment-service/go.mod](services/appointment/appointment-service/go.mod).
    *   `create-appointment/`: A C# (.NET) service for creating appointments [services/appointment/create-appointment/Program.cs](services/appointment/create-appointment/Program.cs).
    *   `get-appointment/`: A C# (.NET) service for retrieving appointments [services/appointment/get-appointment/Program.cs](services/appointment/get-appointment/Program.cs).
    *   `calendar-view/`, `delete-appointment/`, `update-appointment/`: Placeholders for related functionalities.
*   **External Relationships:** Interacts with a database for persistence and potentially with Doctor and Patient services to link appointments to specific doctors and patients.

#### Doctor Service

The **Doctor Service** [services/doctor/](services/doctor/) manages doctor-related information and scheduling.

*   **Purpose:** To handle doctor profiles, availability, and scheduling.
*   **Internal Parts:**
    *   `create-doctor/`: A Node.js service for creating doctor profiles [services/doctor/create-doctor/server.js](services/doctor/create-doctor/server.js).
    *   `delete-doctor/`: A Node.js service for deleting doctor profiles [services/doctor/create-doctor/server.js](services/doctor/delete-doctor/index.js).
    *   `get-available-slots/`: A Node.js service for retrieving doctor's available slots [services/doctor/get-available-slots/index.js](services/doctor/get-available-slots/index.js).
    *   `get-doctor/`: A Node.js service for retrieving doctor profiles [services/doctor/get-doctor/index.js](services/doctor/get-doctor/index.js).
    *   `list-doctors/`: A Node.js service for listing doctors [services/doctor/list-doctors/index.js](services/doctor/list-doctors/index.js).
    *   `schedule-service/`: A Node.js service related to doctor scheduling [services/doctor/schedule-service/index.js](services/doctor/schedule-service/index.js).
    *   `update-doctor/`: A Node.js service for updating doctor profiles [services/doctor/update-doctor/index.js](services/doctor/update-doctor/index.js).
*   **External Relationships:** Interacts with a database for persistence and potentially with the Appointment service for scheduling.

#### Health Record Service

The **Health Record Service** [services/health-record/](services/health-record/) is responsible for managing patient health records.

*   **Purpose:** To store and retrieve patient health information.
*   **Internal Parts:** Placeholders for `create-record/`, `delete-record/`, `get-record/`, `record-history/`, and `update-record/`.
*   **External Relationships:** Interacts with a database for persistence and with the Patient service to link records to patients.

#### Notification Service

The **Notification Service** [services/notification/](services/notification/) handles various types of notifications.

*   **Purpose:** To send email, SMS, and push notifications, and log events.
*   **Internal Parts:** Placeholders for `email-service/`, `event-log-service/`, `push-service/`, `reminder-service/`, and `sms-service/`.
*   **External Relationships:** Receives triggers from other services (e.g., Appointment service for appointment reminders) to send notifications.

#### Patient Service

The **Patient Service** [services/patient/](services/patient/) manages patient information.

*   **Purpose:** To handle patient profiles and related operations.
*   **Internal Parts:**
    *   `create-patient/`: A Go-based service for creating patient profiles [services/patient/create-patient/go.mod](services/patient/create-patient/go.mod).
    *   Placeholders for `delete-patient/`, `get-patient/`, `link-patient/`, `list-patients/`, and `update-patient/`.
*   **External Relationships:** Interacts with a database for persistence and potentially with the Appointment and Health Record services.

#### User Service

The **User Service** [services/user/](services/user/) handles user authentication and management.

*   **Purpose:** To manage user accounts, authentication, and authorization.
*   **Internal Parts:** Placeholders for `auth-user/`, `create-user/`, `delete-user/`, `get-user/`, and `update-user/`.
*   **External Relationships:** Provides authentication and user data to other services. The OpenAPI specification for this service is available at [docs/swagger/user-service.yaml](docs/swagger/user-service.yaml).

### Observability

The **Observability** components [observability/](observability/) are set up for monitoring and logging.

*   **Purpose:** To provide insights into the system's health and performance.
*   **Internal Parts:**
    *   **Prometheus:** Configuration for Prometheus [observability/prometheus.yml](observability/prometheus.yml) for metrics collection.
    *   **Grafana:** Dashboard configuration for Grafana [observability/grafana/dashboard.json](observability/grafability/grafana/dashboard.json) for visualization.
    *   **Logs:** Configuration for log management [observability/logs/config.yml](observability/logs/config.yml).
*   **External Relationships:** Collects metrics and logs from all other services.

### Terraform

The **Terraform** directory [terraform/](terraform/) contains infrastructure-as-code definitions.

*   **Purpose:** To provision and manage the cloud infrastructure for the application.
*   **Internal Parts:**
    *   **Modules:** Reusable infrastructure modules, e.g., for EC2 instances [terraform/modules/ec2/](terraform/modules/ec2/).
    *   **QA Environment:** Specific configurations for the QA environment [terraform/qa/main.tf](terraform/qa/main.tf).
*   **External Relationships:** Deploys and manages resources on a cloud provider.

### Shared Components

The **shared** directory [shared/](shared/) contains common models and utilities that can be used across different services.

*   **Purpose:** To promote code reusability and maintain consistency across the microservices.
*   **Internal Parts:**
    *   **Models:** Placeholder for shared data models [shared/models/.keep](shared/models/.keep).
    *   **Utilities:** Placeholder for shared utility functions [shared/utils/.keep](shared/utils/.keep).
*   **External Relationships:** Used by various microservices.

## Deployment and Orchestration

The project uses **Docker Compose** for local development and orchestration, and **GitHub Actions** for continuous deployment.

*   **Docker Compose Files:**
    *   [docker-compose.yml](docker-compose.yml): Main Docker Compose file.
    *   [docker-compose.frontend.yml](docker-compose.frontend.yml): Specific configuration for the frontend.
    *   [docker-compose.infra.yml](docker-compose.infra.yml): Specific configuration for infrastructure components.
    *   [docker-compose.user.yml](docker-compose.user.yml): Specific configuration for the user service.
*   **GitHub Workflows:**
    *   [deploy-frontend.yml](.github/workflows/deploy-frontend.yml): Workflow for deploying the frontend.
    *   [deploy-infra.yml](.github/workflows/deploy-infra.yml): Workflow for deploying infrastructure.
    *   [deploy-user.yml](.github/workflows/deploy-user.yml): Workflow for deploying the user service.

These files define how the various services are built, run, and interconnected, forming the complete Salud-Link application.

---

## Research Query

has el diagrama de arquitectura

*Session: 58cc9ebc5fcc682da53041a4b5fcb20d | Generated: 7/6/2025, 2:48:14 PM*

### Analysis Summary

# Arquitectura del Sistema Salud Link

El sistema **Salud Link** está diseñado con una arquitectura de microservicios, lo que permite la modularidad, escalabilidad y el desarrollo independiente de sus componentes. Se compone principalmente de un frontend, un API Gateway, múltiples servicios backend, herramientas de observabilidad, flujos de CI/CD y una infraestructura gestionada como código.

## Componentes de Alto Nivel

### **Frontend**
El **Frontend** es la interfaz de usuario de la aplicación, accesible a través de un navegador web.
*   **Propósito**: Proporcionar una experiencia de usuario interactiva para la gestión de citas, información de doctores, pacientes y registros de salud.
*   **Partes Internas**:
    *   Vistas HTML: Define la estructura de las páginas, como la página de inicio [home.html](frontend/views/home.html), el login [login.html](frontend/views/login.html), y las interfaces específicas para doctores [doctor.html](frontend/views/doctor.html) y usuarios [user.html](frontend/views/user.html).
    *   Estilos CSS: Controla la presentación visual de la aplicación [style.css](frontend/css/style.css).
    *   Lógica JavaScript: Maneja la interactividad y la comunicación con el backend. Incluye un script principal [main.js](frontend/js/main.js) y scripts específicos para la funcionalidad de doctor [index.js](frontend/js/doctor/index.js) y usuario [index.js](frontend/js/user/index.js).
*   **Relaciones Externas**: Se comunica directamente con el **API Gateway** para todas las operaciones de datos.

### **API Gateway**
El **API Gateway** actúa como el punto de entrada unificado para todas las solicitudes de los clientes.
*   **Propósito**: Centralizar el acceso a los servicios backend, enrutando las solicitudes a los microservicios apropiados y potencialmente manejando la autenticación y autorización.
*   **Partes Internas**: Actualmente, el directorio [api-gateway/](api-gateway/) contiene un archivo [.keep](api-gateway/.keep), lo que sugiere que es un componente planificado o en desarrollo.
*   **Relaciones Externas**: Recibe solicitudes del **Frontend** y las reenvía a los **Servicios** backend correspondientes.

### **Servicios**
Los **Servicios** son el corazón del backend, implementados como microservicios independientes, cada uno con una responsabilidad de dominio específica.
*   **Propósito**: Encapsular la lógica de negocio y la gestión de datos para funcionalidades específicas del sistema de salud.
*   **Partes Internas**: Cada servicio es un directorio que contiene su propia lógica, configuración y, a menudo, un [Dockerfile](services/appointment/appointment-service/Dockerfile) para su contenedorización.
    *   **Appointment Service**: Gestiona todo lo relacionado con las citas médicas. Incluye sub-servicios como `appointment-service` (Go) [go.mod](services/appointment/appointment-service/go.mod), `create-appointment` (.NET) [Program.cs](services/appointment/create-appointment/Program.cs), `get-appointment` (.NET) [Program.cs](services/appointment/get-appointment/Program.cs), y placeholders para `delete-appointment` y `update-appointment`.
    *   **Doctor Service**: Administra la información de los doctores y sus horarios. Contiene sub-servicios como `create-doctor` [server.js](services/doctor/create-doctor/server.js), `delete-doctor`, `get-available-slots` [index.js](services/doctor/get-available-slots/index.js), `get-doctor`, `list-doctors`, `schedule-service`, y `update-doctor`.
    *   **Health Record Service**: Maneja los registros de salud de los pacientes (actualmente placeholders).
    *   **Notification Service**: Gestiona las notificaciones (email, push, SMS, etc.) (actualmente placeholders).
    *   **Patient Service**: Administra la información de los pacientes. Incluye `create-patient` [Dockerfile](services/patient/create-patient/Dockerfile), y placeholders para `delete-patient`, `get-patient`, `link-patient`, `list-patients`, y `update-patient`.
    *   **User Service**: Se encarga de la autenticación y gestión de usuarios. Incluye placeholders para `auth-user`, `create-user`, `delete-user`, `get-user`, y `update-user`. Su API está documentada en [user-service.yaml](docs/swagger/user-service.yaml).
*   **Relaciones Externas**: Los servicios interactúan entre sí para cumplir con flujos de negocio complejos (ej. el servicio de citas podría consultar al servicio de doctores). También interactúan con bases de datos (implícito por archivos `.env` y directorios `Migrations`).

### **Observability**
El componente de **Observability** se encarga de la monitorización, el registro y la visualización del estado del sistema.
*   **Propósito**: Proporcionar visibilidad sobre el rendimiento y la salud de la aplicación, facilitando la detección y resolución de problemas.
*   **Partes Internas**:
    *   Configuración de Prometheus para la recolección de métricas [prometheus.yml](observability/prometheus.yml).
    *   Dashboard de Grafana para la visualización de métricas [dashboard.json](observability/grafana/dashboard.json).
    *   Configuración de logs [config.yml](observability/logs/config.yml).
*   **Relaciones Externas**: Recopila métricas y logs de todos los **Servicios** desplegados.

### **CI/CD Workflows**
Los **CI/CD Workflows** automatizan los procesos de integración continua y despliegue continuo.
*   **Propósito**: Asegurar que los cambios de código se prueben y desplieguen de manera eficiente y consistente.
*   **Partes Internas**: Definidos en archivos YAML dentro del directorio [.github/workflows/](.github/workflows/).
    *   Flujo de despliegue del frontend [deploy-frontend.yml](.github/workflows/deploy-frontend.yml).
    *   Flujo de despliegue de la infraestructura [deploy-infra.yml](.github/workflows/deploy-infra.yml).
    *   Flujo de despliegue del servicio de usuario [deploy-user.yml](.github/workflows/deploy-user.yml).
*   **Relaciones Externas**: Se activan por eventos en el repositorio (ej. push a una rama) y orquestan el despliegue del **Frontend**, los **Servicios** y la **Infraestructura**.

### **Infrastructure as Code (Terraform)**
**Terraform** se utiliza para definir y provisionar la infraestructura subyacente del sistema.
*   **Propósito**: Gestionar la infraestructura de manera programática, asegurando la consistencia y la reproducibilidad de los entornos.
*   **Partes Internas**:
    *   Configuración principal de la infraestructura [main.tf](terraform/qa/main.tf).
    *   Definición de variables [variables.tf](terraform/qa/variables.tf).
    *   Módulos reutilizables, como el módulo EC2 [modules/ec2](terraform/modules/ec2).
*   **Relaciones Externas**: Provisiona los recursos de cómputo, red y almacenamiento necesarios para el despliegue de los **Servicios** y otros componentes.

### **Documentación**
La **Documentación** proporciona información esencial sobre el diseño y uso del sistema.
*   **Propósito**: Servir como referencia para desarrolladores y operadores, explicando la arquitectura, convenciones y APIs.
*   **Partes Internas**:
    *   Documento de arquitectura [arquitectura.md](docs/arquitectura.md).
    *   Documento de convenciones [convenciones.md](docs/convenciones.md).
    *   Especificación OpenAPI (Swagger) para el servicio de usuario [user-service.yaml](docs/swagger/user-service.yaml).

### **Docker Compose Files**
Los archivos **Docker Compose** se utilizan para definir y ejecutar aplicaciones Docker multi-contenedor.
*   **Propósito**: Facilitar el desarrollo local y el despliegue de los servicios, orquestando cómo se construyen, enlazan y ejecutan los contenedores.
*   **Archivos Clave**:
    *   [docker-compose.yml](docker-compose.yml): Configuración principal.
    *   [docker-compose.frontend.yml](docker-compose.frontend.yml): Configuración específica para el frontend.
    *   [docker-compose.infra.yml](docker-compose.infra.yml): Configuración para componentes de infraestructura.
    *   [docker-compose.user.yml](docker-compose.user.yml): Configuración específica para el servicio de usuario.

---

## Research Query

has un diagrama de arquitectura

*Session: 6f4049006866bfa80f98eba40bb54ed4 | Generated: 7/6/2025, 2:48:55 PM*

### Analysis Summary

# Salud-Link Architecture Overview

## High-Level Architecture

The **Salud-Link** system is designed as a microservices-based application, orchestrated by an **API Gateway** that routes requests to various backend services. A **Frontend** application provides the user interface, interacting with the backend via the API Gateway. **Observability** components are in place for monitoring and logging, and **Terraform** is used for infrastructure provisioning.

*   **Frontend**: The client-side application responsible for user interaction and presentation. It consumes APIs exposed by the **API Gateway**.
    *   Key files: [frontend/css/style.css](frontend/css/style.css), [frontend/js/main.js](frontend/js/main.js), [frontend/views/home.html](frontend/views/home.html)
*   **API Gateway**: Acts as a single entry point for all client requests. It handles request routing, composition, and protocol translation to various microservices.
    *   Location: [api-gateway/](api-gateway/)
*   **Services**: A collection of independent microservices, each responsible for a specific business capability. These services communicate with each other and are exposed externally via the **API Gateway**.
    *   Location: [services/](services/)
*   **Observability**: Provides tools and configurations for monitoring the health and performance of the system, including Prometheus for metrics and Grafana for dashboards.
    *   Key files: [observability/prometheus.yml](observability/prometheus.yml), [observability/grafana/dashboard.json](observability/grafana/dashboard.json)
*   **Terraform**: Manages the infrastructure as code, defining and provisioning the cloud resources required for the application.
    *   Key files: [terraform/qa/main.tf](terraform/qa/main.tf), [terraform/modules/ec2/](terraform/modules/ec2/)

## Services Layer

The **Services** layer is composed of several domain-specific microservices.

### Appointment Service

The **Appointment Service** handles all functionalities related to managing patient appointments.

*   **Purpose**: Manages the lifecycle of appointments, including creation, retrieval, updates, and deletion.
*   **Internal Parts**:
    *   **`appointment-service`**: A Go-based service, likely the core appointment management.
        *   Key files: [services/appointment/appointment-service/Dockerfile](services/appointment/appointment-service/Dockerfile), [services/appointment/appointment-service/go.mod](services/appointment/appointment-service/go.mod)
    *   **`create-appointment`**: A C# service for creating new appointments.
        *   Key files: [services/appointment/create-appointment/Program.cs](services/appointment/create-appointment/Program.cs), [services/appointment/create-appointment/AppointmentApi.csproj](services/appointment/create-appointment/AppointmentApi.csproj)
    *   **`get-appointment`**: A C# service for retrieving appointment details.
        *   Key files: [services/appointment/get-appointment/Program.cs](services/appointment/get-appointment/Program.cs), [services/appointment/get-appointment/get-appointment.csproj](services/appointment/get-appointment/get-appointment.csproj)
    *   **`delete-appointment`**: Placeholder for deleting appointments.
        *   Key files: [services/appointment/delete-appointment/README.md](services/appointment/delete-appointment/README.md)
    *   **`update-appointment`**: Placeholder for updating appointments.
        *   Key files: [services/appointment/update-appointment/README.md](services/appointment/update-appointment/README.md)
    *   **`calendar-view`**: Placeholder for calendar view functionalities.
        *   Key files: [services/appointment/calendar-view/README.md](services/appointment/calendar-view/README.md)
*   **External Relationships**: Interacts with the **User Service** (for patient/doctor identification) and potentially **Notification Service** (for appointment reminders).

### Doctor Service

The **Doctor Service** manages all doctor-related information and functionalities.

*   **Purpose**: Handles doctor profiles, availability, and scheduling.
*   **Internal Parts**:
    *   **`create-doctor`**: Node.js service for registering new doctors.
        *   Key files: [services/doctor/create-doctor/server.js](services/doctor/create-doctor/server.js), [services/doctor/create-doctor/package.json](services/doctor/create-doctor/package.json)
    *   **`delete-doctor`**: Node.js service for removing doctor profiles.
        *   Key files: [services/doctor/delete-doctor/index.js](services/doctor/delete-doctor/index.js), [services/doctor/delete-doctor/package.json](services/doctor/delete-doctor/package.json)
    *   **`get-available-slots`**: Node.js service for retrieving a doctor's available time slots.
        *   Key files: [services/doctor/get-available-slots/index.js](services/doctor/get-available-slots/index.js), [services/doctor/get-available-slots/package.json](services/doctor/get-available-slots/package.json)
    *   **`get-doctor`**: Node.js service for fetching a specific doctor's details.
        *   Key files: [services/doctor/get-doctor/index.js](services/doctor/get-doctor/index.js), [services/doctor/get-doctor/package.json](services/doctor/get-doctor/package.json)
    *   **`list-doctors`**: Node.js service for listing all registered doctors.
        *   Key files: [services/doctor/list-doctors/index.js](services/doctor/list-doctors/index.js), [services/doctor/list-doctors/package.json](services/doctor/list-doctors/package.json)
    *   **`schedule-service`**: Node.js service likely managing doctor schedules.
        *   Key files: [services/doctor/schedule-service/index.js](services/doctor/schedule-service/index.js), [services/doctor/schedule-service/package.json](services/doctor/schedule-service/package.json)
    *   **`update-doctor`**: Node.js service for modifying doctor profiles.
        *   Key files: [services/doctor/update-doctor/index.js](services/doctor/update-doctor/index.js), [services/doctor/update-doctor/package.json](services/doctor/update-doctor/package.json)
*   **External Relationships**: Interacts with the **Appointment Service** (for scheduling) and **User Service** (for doctor user accounts).

### Health Record Service

The **Health Record Service** is responsible for managing patient health records.

*   **Purpose**: Stores and retrieves patient medical history, diagnoses, and treatments.
*   **Internal Parts**:
    *   **`create-record`**: Placeholder for creating new health records.
        *   Key files: [services/health-record/create-record/README.md](services/health-record/create-record/README.md)
    *   **`delete-record`**: Placeholder for deleting health records.
        *   Key files: [services/health-record/delete-record/README.md](services/health-record/delete-record/README.md)
    *   **`get-record`**: Placeholder for retrieving health records.
        *   Key files: [services/health-record/get-record/README.md](services/health-record/get-record/README.md)
    *   **`record-history`**: Placeholder for health record history.
        *   Key files: [services/health-record/record-history/README.md](services/health-record/record-history/README.md)
    *   **`update-record`**: Placeholder for updating health records.
        *   Key files: [services/health-record/update-record/README.md](services/health-record/update-record/README.md)
*   **External Relationships**: Interacts with the **Patient Service** (to link records to patients) and **Doctor Service** (for doctors to access records).

### Notification Service

The **Notification Service** handles various types of notifications within the system.

*   **Purpose**: Sends email, SMS, and push notifications, and logs events.
*   **Internal Parts**:
    *   **`email-service`**: Placeholder for email notifications.
        *   Key files: [services/notification/email-service/README.md](services/notification/email-service/README.md)
    *   **`event-log-service`**: Placeholder for logging system events.
        *   Key files: [services/notification/event-log-service/README.md](services/notification/event-log-service/README.md)
    *   **`push-service`**: Placeholder for push notifications.
        *   Key files: [services/notification/push-service/README.md](services/notification/push-service/README.md)
    *   **`reminder-service`**: Placeholder for sending reminders.
        *   Key files: [services/notification/reminder-service/README.md](services/notification/reminder-service/README.md)
    *   **`sms-service`**: Placeholder for SMS notifications.
        *   Key files: [services/notification/sms-service/README.md](services/notification/sms-service/README.md)
*   **External Relationships**: Consumed by other services (e.g., **Appointment Service** for reminders, **User Service** for account-related notifications).

### Patient Service

The **Patient Service** manages patient profiles and related information.

*   **Purpose**: Handles patient registration, profile management, and linking.
*   **Internal Parts**:
    *   **`create-patient`**: Placeholder for creating new patient profiles.
        *   Key files: [services/patient/create-patient/Dockerfile](services/patient/create-patient/Dockerfile)
    *   **`delete-patient`**: Placeholder for deleting patient profiles.
    *   **`get-patient`**: Placeholder for retrieving patient details.
    *   **`link-patient`**: Placeholder for linking patient accounts.
    *   **`list-patients`**: Placeholder for listing patient profiles.
    *   **`update-patient`**: Placeholder for updating patient profiles.
*   **External Relationships**: Interacts with the **User Service** (for patient user accounts) and **Health Record Service** (to associate records with patients).

### User Service

The **User Service** is responsible for user authentication, authorization, and profile management.

*   **Purpose**: Manages user accounts, including doctors and patients, and handles login/logout.
*   **Internal Parts**:
    *   **`auth-user`**: Handles user authentication.
    *   **`create-user`**: Creates new user accounts.
    *   **`delete-user`**: Deletes user accounts.
    *   **`get-user`**: Retrieves user details.
    *   **`update-user`**: Updates user profiles.
*   **External Relationships**: Provides authentication and user data to all other services. The API Gateway likely interacts heavily with this service for initial authentication.
    *   Swagger documentation: [docs/swagger/user-service.yaml](docs/swagger/user-service.yaml)

