
CREATE DATABASE itcm;

USE itcm;

CREATE TABLE administradores ( -- Entidad administradores
	admin_id INT UNSIGNED AUTO_INCREMENT,
	nombre VARCHAR(255) NOT NULL,
	apellido_paterno VARCHAR(255) NOT NULL,
	apellido_materno VARCHAR(255) NOT NULL,
	correo VARCHAR(100) NOT NULL,
	contrasena VARCHAR(255) NOT NULL,
	PRIMARY KEY(admin_id)
);


CREATE TABLE alumnos (-- Entidad alumnos
	alumno_id INT UNSIGNED AUTO_INCREMENT,
	nombre VARCHAR(255) NOT NULL,
	apellido_paterno VARCHAR(255) NOT NULL,
	apellido_materno VARCHAR(255) NOT NULL,
	sexo VARCHAR(100) NOT NULL,
	numero_control INT NOT NULL,
	carrera VARCHAR(100) NOT NULL,
	semestre VARCHAR(100) NOT NULL,
	correo VARCHAR(100) NOT NULL,
	contrasena VARCHAR(100) NOT NULL,
	PRIMARY KEY(alumno_id)
);



CREATE TABLE resultados (-- Entidad resultados
	resultado_id INT UNSIGNED AUTO_INCREMENT,
	nombre VARCHAR(255) NOT NULL,
	apellido_paterno VARCHAR(255) NOT NULL,
	apellido_materno VARCHAR(255) NOT NULL,
	numero_control INT NOT NULL,
	carrera VARCHAR(100) NOT NULL,
	resultado INT NOT NULL,
	respuesta TEXT NOT NULL,
	PRIMARY KEY(resultado_id)
);

INSERT INTO resultados (nombre, apellido_paterno, apellido_materno, numero_control, carrera, resultado, respuesta) VALUES ('Osiris', 'Reyez', 'Guzman', '19071581', 'Sistemas computacionales', '43', '');
INSERT INTO resultados (nombre, apellido_paterno, apellido_materno, numero_control, carrera, resultado, respuesta) VALUES ('Tomas', 'Martinez', 'Mendoza', '19071522', 'Sistemas computacionales', '3', '');
INSERT INTO administradores(nombre, apellido_paterno, apellido_materno, correo, contrasena) VALUES ('admin', 'admin', 'admin', 'admin@cdmadero.tecnm.mx', 'admin1234'); 


SELECT * FROM administradores;
SELECT * FROM alumnos;
SELECT * FROM resultados;
SELECT * FROM alumnos WHERE correo = 'ejemplo@gmail.com'; 

DROP TABLE resultados;
DROP TABLE alumnos;
DROP TABLE administradores;

SELECT correo FROM administradores WHERE correo ='admin@cdmadero.tecnm.mx' AND contrasena = 'admin1234';

