# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

```
-- Создать базу данных
CREATE DATABASE flussonic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Создать пользователя и задать пароль
CREATE USER 'flussonic'@'127.0.0.1' IDENTIFIED BY 'z1t89e5g7wq3msr6v2n0xdkf4lujabci';

-- Выдать все права на базу данных
GRANT ALL PRIVILEGES ON flussonic_db.* TO 'flussonic'@'127.0.0.1';

-- Обновить привилегии
FLUSH PRIVILEGES;



-- 1. Таблица addresses
CREATE TABLE addresses (
id INT AUTO_INCREMENT PRIMARY KEY,
city VARCHAR(100),
street VARCHAR(100),
house_number VARCHAR(20)
);

-- 2. Таблица dvr
CREATE TABLE dvr (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
path TEXT
);

-- 3. Таблица webcam
CREATE TABLE webcam (
id INT AUTO_INCREMENT PRIMARY KEY,
uid VARCHAR(100) UNIQUE NOT NULL ,
name VARCHAR(100) NOT NULL ,      
url TEXT NOT NULL ,               
dvr_id INT,
address_id INT,
role ENUM('public', 'private') DEFAULT 'public',
day_count INT DEFAULT 0,
FOREIGN KEY (dvr_id) REFERENCES dvr(id),
FOREIGN KEY (address_id) REFERENCES addresses(id)
);

-- 4. Таблица clients_tmp (временные клиенты)
CREATE TABLE clients_tmp (
id INT AUTO_INCREMENT PRIMARY KEY,
fio VARCHAR(100),
phone VARCHAR(20),
password VARCHAR(255),
token VARCHAR(255),
created DATETIME DEFAULT CURRENT_TIMESTAMP,
ccess_until DATETIME,
);

-- 4.1 Таблица соответствия временных клиентов и адресов
CREATE TABLE clients_tmp_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  address_id INT,
  FOREIGN KEY (client_id) REFERENCES clients_tmp(id) ON DELETE CASCADE,
  FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE
);

-- 5. Таблица users (постоянные клиенты)
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
password VARCHAR(255),
ip VARCHAR(45),  -- IPv4 или IPv6
date DATETIME DEFAULT CURRENT_TIMESTAMP,
address_id INT,
token VARCHAR(255),
FOREIGN KEY (address_id) REFERENCES addresses(id)
);

-- 6. Таблица settings
CREATE TABLE settings (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(100),
cdn_url TEXT DEFAULT 'http://localhost:8888',
pubt VARCHAR(255),
privt VARCHAR(255)
);

```

Конфиг Flussonic
```angular2html
# Global settings:
http 88;
geoip RU;
rtsp 554;
rtmp 1935;
pulsedb /var/lib/flussonic;
session_log /var/lib/flussonic;
edit_auth root kjifHm11.06!;
auth_backend Nodejs {
  backend http://app.local/api/flussonic/auth;
}

# DVRs:

# Remote sources:

# Balancer:

# Stream templates:
template _pubcam {
  thumbnails;
  protocols -dash -m4f -m4s -mss -rtmp -rtsp -tshttp;
}
template _privcam {
  on_play auth://Nodejs;
  thumbnails;
  protocols -dash -m4f -m4s -mss -rtmp -tshttp;
}

# Ingest streams:

# Disk file caches:

# VOD locations:

# DVB cards:

# Components:
iptv;


```