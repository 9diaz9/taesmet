
# TAESMET Mantenimiento (Spring Boot + PostgreSQL + Thymeleaf)

- Roles: `ADMIN`, `LIDER`, `TECNICO`
- Postgres configurado en `src/main/resources/application.properties`
- Validaciones usando `jakarta.validation`
- Entidades: `Usuario`, `Maquina`, `Mantenimiento`, `SolicitudRepuesto`, `Auditoria` y enums de catálogo
- Páginas Thymeleaf listas (login, panel, CRUD básico de usuarios/maquinas, asignación, solicitudes de repuestos)

## Ejecutar
1. Configura Postgres y crea DB `taesmet_mtto`
2. Ajusta usuario/clave en `application.properties`
3. `mvn spring-boot:run`

## Siguientes pasos
- Vista calendario mensual para técnicos
- Auditoría completa (guardar acciones)
- Notificaciones por correo
- Carga de catálogo por CSV
- Estados y filtros avanzados
