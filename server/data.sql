CREATE DATABASE todo_app;

CREATE TABLE todos (
	id VARCHAR(255) PRIMARY KEY,
	user_email VARCHAR(255),
	title VARCHAR(30),
	progress int,
	date VARCHAR(255)
);

CREATE TABLE users (
	email VARCHAR(255) PRIMARY KEY,
	hashed_password VARCHAR(255)
);
