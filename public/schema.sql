CREATE TABLE User (
   user_id INT AUTO_INCREMENT PRIMARY KEY,
   user_username VARCHAR(255) NOT NULL UNIQUE KEY,
   user_fname VARCHAR(255),
   user_lname VARCHAR(255),
   user_phone VARCHAR(255) UNIQUE KEY,
   user_email VARCHAR(255) UNIQUE KEY,
   user_address VARCHAR(255),
   user_city VARCHAR(255),
   user_state VARCHAR(255),
   user_zipcode INT
) ENGINE=InnoDB;

CREATE TABLE Location_Type (
   location_type_id INT AUTO_INCREMENT PRIMARY KEY,
   location_type_name VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE Location (
   location_id INT AUTO_INCREMENT PRIMARY KEY,
   location_lat DOUBLE NOT NULL UNIQUE KEY,
   location_lon DOUBLE NOT NULL,
   location_last_regulations_update DATETIME,
   location_last_availability_update DATETIME,
   fk_location_type_id INT,
   location_availability INT,
   location_cost FLOAT,
   location_regulations VARCHAR(255),
   FOREIGN KEY (fk_location_type_id) REFERENCES Location_Type(location_type_id)
) ENGINE=InnoDB;

CREATE TABLE Saved_Location (
   saved_location_id INT AUTO_INCREMENT PRIMARY KEY,
   fk_user_id INT NOT NULL,
   fk_location_id INT NOT NULL,
   FOREIGN KEY (fk_user_id) REFERENCES User(user_id),
   FOREIGN KEY (fk_location_id) REFERENCES Location(location_id)
) ENGINE=InnoDB;

INSERT INTO Location_Type (location_type_name) VALUES ('Street');
INSERT INTO Location_Type (location_type_name) VALUES ('Lot');
INSERT INTO Location_Type (location_type_name) VALUES ('Garage');
INSERT INTO Location_Type (location_type_name) VALUES ('Permit');