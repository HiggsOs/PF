import os
from typing import List, Optional

import mysql.connector
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

MYSQL_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "mysql"),
    "port": int(os.getenv("MYSQL_PORT", "3306")),
    "database": os.getenv("MYSQL_DB", os.getenv("MYSQL_DATABASE", "power_metrics")),
    "user": os.getenv("MYSQL_USER", "app_user"),
    "password": os.getenv("MYSQL_PASSWORD", "app_password"),
}

DEFAULT_LIMIT = 100


class Measurement(BaseModel):
    id: int
    collected_at: str
    current_1: Optional[float]
    current_2: Optional[float]
    current_3: Optional[float]
    voltage_1: Optional[float]
    voltage_2: Optional[float]
    voltage_3: Optional[float]
    power_1: Optional[float]
    power_2: Optional[float]
    power_3: Optional[float]


app = FastAPI(title="Power Metrics API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_connection():
    return mysql.connector.connect(**MYSQL_CONFIG)


@app.get("/health")
def health():
    try:
        with get_connection() as conn:
            conn.cursor().execute("SELECT 1")
        return {"status": "ok"}
    except mysql.connector.Error as exc:
        raise HTTPException(status_code=503, detail=f"MySQL unavailable: {exc}")


@app.get("/metrics", response_model=List[Measurement])
def list_metrics(limit: int = DEFAULT_LIMIT):
    limit = max(1, min(limit, 1000))
    try:
        with get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                """
                SELECT id, collected_at, current_1, current_2, current_3,
                       voltage_1, voltage_2, voltage_3,
                       power_1, power_2, power_3
                FROM measurements
                ORDER BY collected_at DESC
                LIMIT %s
                """,
                (limit,),
            )
            rows = cursor.fetchall()
    except mysql.connector.Error as exc:
        raise HTTPException(status_code=500, detail=f"MySQL query failed: {exc}")

    return [Measurement(**row) for row in rows]


@app.get("/")
def root():
    return {"message": "Use /metrics to retrieve measurements"}
