---
name: security-hardening
description: Trigger automático al diseñar autenticación, manejar tokens, contraseñas, cookies, headers CORS o sanitizar entradas del usuario.
---
# Security Hardening & OWASP Compliance
Asegura que tu aplicación cumpla con los estándares básicos de seguridad:
- **Sanitización:** Valida y sanitiza todo input del usuario antes de consultas a base de datos (inyección SQL) o renderizado (XSS).
- **Tokens/Auth:** Almacena JWT en cookies secure/httpOnly, implementa rotación de tokens y expiración corta.
- **Headers:** Configura CSP (Content Security Policy) estricta, CORS limitados y headers de seguridad HTTP esenciales.