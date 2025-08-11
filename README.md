# PROPUESTA DE PROYECTO FINAL
## Sistema Inteligente de Diagnóstico Automotriz con IA Conversacional

**Programa:** Ingeniería Electrónica  
**Universidad del Norte**  
**Fecha:** Agosto 2025

---

## 1. RESUMEN EJECUTIVO

Es un sistema integral de diagnóstico automotriz que combina hardware personalizado, análisis de datos OBD-II , e inteligencia artificial conversacional para proporcionar diagnóstico predictivo y asistencia técnica especializada a propietarios de vehículos y talleres.

El proyecto aborda el problema complejo de la interpretación de datos vehiculares, transformando información técnica cruda en insights accionables a través de una interfaz conversacional inteligente que "habla" con el usuario sobre el estado de su vehículo.

---

## 2. PLANTEAMIENTO DEL PROBLEMA

### 2.1 Problemática Identificada

**Problema Técnico:**
- Los datos OBD-II son técnicamente complejos y requieren interpretación especializada
- Los códigos de error (DTC) proporcionan información limitada sin contexto
- Falta de sistemas predictivos accesibles para mantenimiento vehicular
- Brecha entre datos crudos del vehículo y comprensión del usuario final

**Problema de Mercado:**
- 15+ millones de vehículos en Colombia con puerto OBD-II obligatorio
- 85% de propietarios no comprenden los códigos de diagnóstico de sus vehículos
- Talleres pequeños carecen de herramientas de diagnóstico avanzadas
- Costos elevados de herramientas profesionales de diagnóstico ($2M+ COP)

### 2.2 Restricciones Reales del Proyecto

**Económicas:** Presupuesto limitado para desarrollo ($400k COP)  
**Tecnológicas:** Compatibilidad con múltiples protocolos OBD-II  
**Regulatorias:** Cumplimiento con estándares SAE e ISO automotrices  
**Sociales:** Accesibilidad para usuarios no técnicos  
**Ambientales:** Contribución a mantenimiento preventivo y reducción de emisiones  
**Tiempo:** Desarrollo en 16 semanas con recursos limitados

---

## 3. SOLUCIÓN PROPUESTA

### 3.1 Arquitectura del Sistema

**Componente Hardware:**
- **Adaptador OBD-II Inteligente** basado en ESP32
- Procesamiento edge para filtrado y compresión de datos
- Comunicación WiFi/Bluetooth para transmisión en 
- Buffer local para operación offline

**Componente Software:**
- **Backend API RESTful** (FastAPI + MySQL)
- **Motor de análisis** con algoritmos de machine learning predictivo
- **Integración LLM** (OpenAI/Claude) para interpretación conversacional
- **Aplicación móvil/web** con interfaz usuario intuitiva

**Componente Inteligencia Artificial:**
- **Modelo conversacional** entrenado en terminología automotriz
- **Sistema de reglas expertas** para diagnóstico automático
- **Algoritmos predictivos** para detección temprana de fallas
- **Base de conocimientos** integrada con manuales técnicos

### 3.2 Funcionalidades Principales

1. **Diagnóstico en :** Análisis continuo de parámetros OBD-II
2. **Predicción de Fallas:** Detección de anomalías 24-48h antes del código DTC
3. **Asistente Conversacional:** Explicación en lenguaje natural de problemas detectados
4. **Historial Inteligente:** Tracking de salud vehicular a largo plazo
5. **Recomendaciones Predictivas:** Sugerencias de mantenimiento proactivo

---

## 4. JUSTIFICACIÓN TÉCNICA

### 4.1 Complejidad del Problema de Ingeniería

Este proyecto califica como **problema complejo** según criterios ABET por:

- **Requerimientos conflictivos:** Precisión técnica vs. simplicidad de uso
- **Múltiples stakeholders:** Propietarios, mecánicos, desarrolladores, reguladores
- **Integración multidisciplinaria:** Electrónica, software, IA, automotriz
- **No existe solución obvia:** Requiere innovación en UX y procesamiento de datos
- **Múltiples subsistemas:** Hardware, comunicaciones, ML, UI/UX
- **Consecuencias significativas:** Impacto en seguridad vehicular y economía familiar

### 4.2 Estándares de Ingeniería Aplicables

**SAE J1979:** Protocolo estándar para comunicación OBD-II  
**ISO 14229:** Servicios de diagnóstico unificados (UDS)  
**IEEE 802.11:** Estándares de comunicación inalámbrica  
**ISO/IEC 27001:** Gestión de seguridad de la información  
**SAE J2012:** Códigos de problemas de diagnóstico estandarizados  
**ISO 26262:** Seguridad funcional en sistemas automotrices

### 4.3 Criterios de Diseño

**Precisión:** >95% en detección de códigos DTC vs. herramientas comerciales  
**Latencia:** <3 segundos para respuesta conversacional  
**Disponibilidad:** 99.5% uptime del sistema  
**Escalabilidad:** Soporte para 1000+ usuarios concurrentes  
**Seguridad:** Encriptación end-to-end de datos vehiculares  
**Usabilidad:** Interfaz comprensible para usuarios no técnicos

---

## 5. VIABILIDAD TÉCNICA

### 5.1 Recursos Humanos
- **2 estudiantes Ingeniería Electrónica** con experiencia en:
  - Desarrollo web (FastAPI, React, bases de datos)
  - Microcontroladores (ESP32, C++)
  - Integración de APIs y servicios cloud
  - Proyectos de visión por computadora y LLMs

### 5.2 Recursos Tecnológicos
- **Hardware:** ESP32, componentes electrónicos, PCB personalizada
- **Software:** APIs de LLM, servicios cloud (AWS/Supabase), herramientas de desarrollo
- **Infraestructura:** Servidor cloud, base de datos, servicios de hosting

### 5.3 Recursos Financieros
- **Presupuesto total:** $400,000 COP
- **Distribución:** Hardware (30%), Cloud services (37.5%), APIs (20%), Validación (12.5%)

### 5.4 Acceso a Vehículos para Validación
- **Vehículo principal:** Hyundai Accent i25 2013 (acceso semanal)
- **Vehículos adicionales:** Red de contactos para pruebas diversificadas
- **Talleres colaboradores:** Alianzas locales para validación profesional

---

## 6. EXPERIENCIA DE DISEÑO

### 6.1 Proceso de Diseño de Ingeniería

**Identificación del Problema:**
- Investigación de mercado y análisis de necesidades
- Benchmarking con soluciones existentes
- Definición de requerimientos técnicos y de usuario

**Generación de Alternativas:**
- **Alternativa 1:** Sistema puramente cloud-based
- **Alternativa 2:** Solución embedded standalone
- **Alternativa 3:** Arquitectura híbrida edge-cloud 

**Criterios de Selección:**
- Costo-beneficio de implementación
- Escalabilidad técnica y comercial
- Experiencia de usuario optimizada
- Viabilidad con recursos disponibles

**Diseño Detallado:**
- Arquitectura de software modular
- Diseño de PCB para adaptador OBD
- Protocolos de comunicación optimizados
- Interfaz de usuario conversacional

**Validación:**
- Plan de pruebas experimentales riguroso
- Métricas de rendimiento cuantificables
- Validación con usuarios reales

### 6.2 Innovaciones Técnicas

1. **Procesamiento Edge Inteligente:** Algoritmos optimizados en ESP32
2. **Modelo Conversacional Especializado:** LLM fine-tuned para automotriz
3. **Sistema Predictivo Híbrido:** ML + reglas expertas + conocimiento dominio
4. **Arquitectura Multi-tenant:** SaaS escalable desde el primer día

---

## 7. PLAN DE VALIDACIÓN EXPERIMENTAL

### 7.1 Hipótesis Técnicas
1. **H1:** El sistema detectará códigos DTC con ≥95% precisión vs. herramientas comerciales
2. **H2:** Los algoritmos predictivos identificarán anomalías 24-48h antes del código DTC
3. **H3:** La interfaz conversacional reducirá tiempo de comprensión en ≥60%

### 7.2 Variables de Diseño
- Frecuencia de muestreo de datos OBD (1-10 Hz)
- Algoritmos de ML utilizados (Random Forest, SVM, Neural Networks)
- Umbrales de detección de anomalías
- Parámetros de fine-tuning del modelo conversacional

### 7.3 Metodología Experimental
- **Muestra:** 10+ vehículos diferentes (marcas, años, estados)
- **Grupos de control:** Herramientas comerciales (Autel, Launch)
- **Métricas:** Precisión, recall, F1-score, tiempo de respuesta
- **Análisis estadístico:** ANOVA, test t-student, intervalos de confianza

---

## 8. IMPACTOS Y CONSIDERACIONES ÉTICAS

### 8.1 Impacto Tecnológico
- Democratización del diagnóstico automotriz avanzado
- Contribución a la transformación digital del sector automotriz
- Reducción de la brecha tecnológica entre talleres grandes y pequeños

### 8.2 Impacto Social
- **Positivo:** Reducción de costos de mantenimiento para familias
- **Positivo:** Mejora en seguridad vial por mantenimiento predictivo
- **Consideración:** Protección de privacidad de datos vehiculares

### 8.3 Impacto Ambiental
- **Positivo:** Optimización de mantenimiento reduce emisiones
- **Positivo:** Extensión de vida útil de vehículos
- **Positivo:** Reducción de residuos por reparaciones innecesarias

### 8.4 Impacto Económico
- **Mercado potencial:** $50M+ USD en Colombia
- **Creación de empleo:** Oportunidades en tech automotriz
- **Ahorro familiar:** 20-30% reducción en costos de diagnóstico

### 8.5 Consideraciones Éticas
- **Privacidad:** Implementación de protección de datos vehiculares
- **Transparencia:** Algoritmos explicables en decisiones críticas
- **Accesibilidad:** Interfaz inclusiva para usuarios con diferentes capacidades
- **Responsabilidad:** Disclaimers apropiados para diagnósticos automáticos

---

## 9. CRONOGRAMA PRELIMINAR

| Semana | Actividad Principal | Entregables |
|--------|-------------------|-------------|
| 1-4 | Diseño y arquitectura | Documentación técnica, PCB design |
| 5-8 | Desarrollo core | Hardware funcional, backend MVP |
| 9-12 | Integración IA | Sistema conversacional, ML models |
| 13-16 | Validación y documentación | Testing completo, informe final |

---

## 10. VIABILIDAD COMERCIAL

### 10.1 Modelo de Negocio
- **B2C Freemium:** Funciones básicas gratuitas, premium por suscripción
- **B2B SaaS:** Licenciamiento para talleres ($50k COP/mes)
- **B2B2C:** Partnerships con aseguradoras y flotas empresariales

### 10.2 Ventaja Competitiva
- **Primera solución conversacional** en español para diagnóstico automotriz
- **Precio accesible** vs. herramientas profesionales
- **Arquitectura cloud-native** escalable globalmente
- **Enfoque en mercado latam** con regulaciones OBD específicas

### 10.3 Escalabilidad
- **Mercado inicial:** Colombia (15M vehículos)
- **Expansión regional:** México, Argentina, Chile
- **Diversificación:** Flotas comerciales, seguros, financieras automotrices

---

## 11. CONCLUSIONES

Este sistema representa una oportunidad única de aplicar tecnologías emergentes (IA conversacional, edge computing, ML predictivo) a un problema real del sector automotriz, con potencial de impacto social y comercial significativo.

El proyecto cumple todos los criterios ABET para problemas complejos de ingeniería, integra múltiples disciplinas, y ofrece una experiencia de diseño completa desde la conceptualización hasta la validación experimental.

La combinación de viabilidad técnica, recursos disponibles, y potencial de mercado hace de esta propuesta una oportunidad ideal para un proyecto final de ingeniería electrónica con orientación comercial.

---
