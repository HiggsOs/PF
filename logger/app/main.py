import json
import logging
import os
import re
import time
from datetime import datetime
from typing import Any, Dict, Optional

import mysql.connector
import paho.mqtt.client as mqtt

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

MQTT_HOST = os.getenv("MQTT_HOST", "mosquitto")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "esp32/ina219")
MQTT_CLIENT_ID = os.getenv("MQTT_CLIENT_ID", "mqtt-logger")

MYSQL_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "mysql"),
    "port": int(os.getenv("MYSQL_PORT", "3306")),
    "database": os.getenv("MYSQL_DB", "power_metrics"),
    "user": os.getenv("MYSQL_USER", "app_user"),
    "password": os.getenv("MYSQL_PASSWORD", "app_password"),
}


def ensure_db_connection() -> mysql.connector.connection.MySQLConnection:
    while True:
        try:
            conn = mysql.connector.connect(**MYSQL_CONFIG)
            logger.info("Conexión a MySQL establecida")
            return conn
        except mysql.connector.Error as exc:
            logger.error("Error conectando a MySQL: %s. Reintentando en 5s", exc)
            time.sleep(5)


def create_table_if_needed(conn: mysql.connector.connection.MySQLConnection) -> None:
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS measurements (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            collected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            current_1 DOUBLE,
            current_2 DOUBLE,
            current_3 DOUBLE,
            voltage_1 DOUBLE,
            voltage_2 DOUBLE,
            voltage_3 DOUBLE,
            power_1 DOUBLE,
            power_2 DOUBLE,
            power_3 DOUBLE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """
    )
    conn.commit()
    cursor.close()


def normalize_payload(payload: bytes) -> Optional[Dict[str, Any]]:
    try:
        raw_data = json.loads(payload.decode("utf-8"))
        return raw_data
    except (UnicodeDecodeError, json.JSONDecodeError):
        pass

    try:
        text = payload.decode("utf-8").strip()
    except UnicodeDecodeError:
        logger.warning("Mensaje MQTT no es JSON válido: %s", payload)
        return None

    if text.startswith("'") and text.endswith("'"):
        text = text[1:-1]

    text = re.sub(r"(?P<key>\b\w+\b)\s*:", r'"\g<key>":', text)

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        logger.warning("Mensaje MQTT no es JSON válido: %s", payload)
        return None


def parse_payload(payload: bytes) -> Optional[Dict[str, Any]]:
    raw_data = normalize_payload(payload)
    if raw_data is None:
        return None

    def as_float(value: Any) -> Optional[float]:
        try:
            return float(value) if value is not None else None
        except (TypeError, ValueError):
            return None

    return {
        "current_1": as_float(raw_data.get("current_1")),
        "current_2": as_float(raw_data.get("current_2")),
        "current_3": as_float(raw_data.get("current_3")),
        "voltage_1": as_float(raw_data.get("voltage_1")),
        "voltage_2": as_float(raw_data.get("voltage_2")),
        "voltage_3": as_float(raw_data.get("voltage_3")),
        "power_1": as_float(raw_data.get("power_1")),
        "power_2": as_float(raw_data.get("power_2")),
        "power_3": as_float(raw_data.get("power_3")),
    }


def save_measurement(conn: mysql.connector.connection.MySQLConnection, data: Dict[str, Any]) -> None:
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO measurements (
            collected_at, current_1, current_2, current_3,
            voltage_1, voltage_2, voltage_3,
            power_1, power_2, power_3
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            datetime.now(),
            data["current_1"],
            data["current_2"],
            data["current_3"],
            data["voltage_1"],
            data["voltage_2"],
            data["voltage_3"],
            data["power_1"],
            data["power_2"],
            data["power_3"],
        ),
    )
    conn.commit()
    cursor.close()


def main() -> None:
    conn = ensure_db_connection()
    create_table_if_needed(conn)

    def on_connect(client: mqtt.Client, _userdata, _flags, rc):
        if rc == 0:
            logger.info("Conectado a MQTT en %s:%s", MQTT_HOST, MQTT_PORT)
            client.subscribe(MQTT_TOPIC)
            logger.info("Suscrito al tópico %s", MQTT_TOPIC)
        else:
            logger.error("Fallo al conectar a MQTT. Código: %s", rc)

    def on_message(_client: mqtt.Client, _userdata, msg: mqtt.MQTTMessage):
        nonlocal conn
        parsed = parse_payload(msg.payload)
        if parsed is None:
            return

        try:
            save_measurement(conn, parsed)
            logger.info("Dato guardado en la base de datos: %s", parsed)
        except mysql.connector.Error as exc:
            logger.error("Error guardando en la base de datos: %s. Intentando reconexión.", exc)
            try:
                conn.close()
            except Exception:
                logger.debug("No se pudo cerrar la conexión previa a MySQL")
            conn = ensure_db_connection()
            create_table_if_needed(conn)

    mqtt_client = mqtt.Client(client_id=MQTT_CLIENT_ID, clean_session=True)
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message

    while True:
        try:
            mqtt_client.connect(MQTT_HOST, MQTT_PORT, keepalive=60)
            mqtt_client.loop_forever()
        except Exception as exc:
            logger.error("Desconectado de MQTT: %s. Reintentando en 5s", exc)
            time.sleep(5)


if __name__ == "__main__":
    main()
