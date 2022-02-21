CREATE DATABASE devtask;

CREATE TABLE registration(
   user_id SERIAL PRIMARY KEY,
   u_name varchar(255),
   email varchar(255),
   pass varchar(255),
   gender varchar(255),
   age varchar(255)
);

CREATE TABLE category(
   category_id INT GENERATED ALWAYS AS IDENTITY,
   category_name VARCHAR(255) NOT NULL,
   category_description VARCHAR(255),
   PRIMARY KEY(category_id)
);

CREATE TABLE product(
   product_id INT GENERATED ALWAYS AS IDENTITY,
   category_id INT,
   product_name VARCHAR(255) NOT NULL,
   product_image VARCHAR(15),
   description VARCHAR(100),
   PRIMARY KEY(product_id),
   CONSTRAINT fk_category
      FOREIGN KEY(category_id) 
	  REFERENCES category(category_id)
);