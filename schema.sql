DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(50) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER NOT NULL,
	PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Apple MacBook Pro","Computers", 1499.99, 5000), ("Audio Technica Turntable","Electronics", 249.99, 3000), ("Sony Playstation 4","Electronics", 299.99, 2500), ("Cards Against Humanity","Toys and Games", 24.99, 10000),
("Ibanez Rgd2127z Guitar","Musical Instruments", 1499.99, 100), ("Apple iPhone 6s","Electronics", 499.99, 4000), ("Fender American Stratocaster Guitar","Musical Instruments", 1399.99, 1500), ("Levis 511 Jeans","Clothing", 49.99, 6000), ("Hanes T-Shirt","Clothing", 4.99, 5000), ("Atlanta Braves Hat","Clothing", 19.99, 400);
