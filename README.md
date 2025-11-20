# Cómo lanzar el stack

Este repositorio levanta un stack completo con Docker Compose:

- **Mosquitto** (MQTT) en `1883`.
- **MySQL** persistente en `3306` (listo para conectarse desde DBeaver u otro cliente).
- **Logger Python** que lee del tópico MQTT y guarda en MySQL.
- **API FastAPI** para consultar las mediciones en `8000`.
- **Microdashboard React** para graficar corriente, voltaje y potencia en `3000`.

## Requisitos previos

- Docker y Docker Compose instalados.
- Puertos `1883`, `3306`, `8000` y `3000` libres en tu host.

## Pasos rápidos

1. **Opcional:** copia y ajusta variables de entorno.

   ```bash
   cp .env.example .env
   # Edita credenciales MySQL, tópico MQTT, etc. si lo necesitas
   ```

2. **Construye y levanta todo** (primera vez incluye la compilación de las imágenes del API y el dashboard):

   ```bash
   docker compose up -d --build
   ```

3. **Verifica que todo esté arriba:**

   ```bash
   docker compose ps
   ```

4. **Prueba la base de datos desde DBeaver u otro cliente:**
   - Host: `localhost`
   - Puerto: `3306`
   - Usuario: `app_user` (o el que pusiste en `.env`)
   - Password: `app_password`
   - Base: `power_metrics`

5. **Abre el dashboard:** visita <http://localhost:3000> para ver las gráficas. El frontend consulta el API en <http://localhost:8000/metrics>.

6. **Publica un mensaje de prueba en MQTT** (opcional):

   ```bash
   docker compose exec mosquitto mosquitto_pub -h mosquitto -p 1883 -t esp32/ina219 -m '{"current_1":0.1,"current_2":0.2,"current_3":0.3,"voltage_1":220,"voltage_2":221,"voltage_3":219,"power_1":50,"power_2":55,"power_3":48}'
   ```

7. **Consulta manualmente el API:**

   ```bash
   curl http://localhost:8000/metrics
   ```

## Servicios y volúmenes

- Los datos de MySQL se guardan en el volumen Docker `mysql_data` para que sean persistentes entre reinicios.
- Mosquitto guarda datos y logs en `mosquitto_data` y `mosquitto_log`.
- La tabla `measurements` se crea automáticamente al iniciar MySQL gracias al script en `mysql/initdb/01_create_measurements.sql`.

## Detener y limpiar

- Para apagar los contenedores sin borrar datos:

  ```bash
  docker compose down
  ```

- Para borrar también los volúmenes (incluye la base de datos):

  ```bash
  docker compose down -v
  ```
