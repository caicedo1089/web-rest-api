<?php

/////Soporte a .env
$dotenv = new Dotenv\Dotenv( __DIR__ . '/..' );
$dotenv->load();

/////Cargamos la BD y ORM
require 'database.php';