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
