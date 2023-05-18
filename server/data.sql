CREATE DATABASE todo_app;

CREATE TABLE todos (
	id VARCHAR(255) PRIMARY KEY,
	user_email VARCHAR(30),
	title VARCHAR(30),
	progress int,
	data VARCHAR(30)
);

CREATE TABLE users (
	email VARCHAR(255) PRIMARY KEY,
	hashed_password VARCHAR(255)
);

ALTER TABLE todos ALTER COLUMN data type VARCHAR(120);
