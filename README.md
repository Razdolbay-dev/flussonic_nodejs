# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

```
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
name VARCHAR(100),
title VARCHAR(100),
description TEXT,
url TEXT,
dvr_id INT,
preset VARCHAR(100),
address_id INT,
role ENUM('public', 'private') DEFAULT 'private',
day_count INT DEFAULT 0,
FOREIGN KEY (dvr_id) REFERENCES dvr(id),
FOREIGN KEY (address_id) REFERENCES addresses(id)
);

-- 4. Таблица clients_tmp (временные клиенты)
CREATE TABLE clients_tmp (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
title VARCHAR(100),
phone VARCHAR(20),
password VARCHAR(255),
token VARCHAR(255),
created DATETIME DEFAULT CURRENT_TIMESTAMP,
deleted DATETIME
);

-- 4.1 Таблица соответствия клиентов и камер (временный доступ)
CREATE TABLE clients_tmp_webcams (
id INT AUTO_INCREMENT PRIMARY KEY,
client_id INT,
webcam_id INT,
access_until DATETIME,
FOREIGN KEY (client_id) REFERENCES clients_tmp(id) ON DELETE CASCADE,
FOREIGN KEY (webcam_id) REFERENCES webcam(id) ON DELETE CASCADE
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
cdn_url TEXT
);

```
