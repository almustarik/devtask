CREATE DATABASE devtask;

CREATE TABLE users (
  id serial primary key,
  user_name varchar(40),
  email citext not null unique,
  password varchar not null,
  gender varchar(10),
  age int 
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
   price int,
   PRIMARY KEY(product_id),
   CONSTRAINT fk_category
      FOREIGN KEY(category_id) 
	  REFERENCES category(category_id)
);

CREATE TABLE orders(
	order_id serial primary key,
	user_id int not null,
	product_id int not null,
	FOREIGN KEY(user_id) REFERENCES users(user_id),
	FOREIGN KEY(product_id) REFERENCES product(product_id)
)