DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `Location`;
DROP TABLE IF EXISTS `Saved_Location`;

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




CREATE TABLE Client (
   client_id INT AUTO_INCREMENT PRIMARY KEY,
   client_fname VARCHAR(255) NOT NULL,
   client_lname VARCHAR(255) NOT NULL,
   client_phone VARCHAR(255) NOT NULL UNIQUE KEY,
   client_email VARCHAR(255) NOT NULL UNIQUE KEY,
   CONSTRAINT name UNIQUE (client_fname, client_lname)
) ENGINE=InnoDB;

CREATE TABLE Venue (
   venue_id INT AUTO_INCREMENT PRIMARY KEY,
   venue_name VARCHAR(255) NOT NULL UNIQUE KEY,
   venue_phone VARCHAR(255) NOT NULL UNIQUE KEY,
   venue_email VARCHAR(255) NOT NULL UNIQUE KEY,
   venue_address VARCHAR(255) NOT NULL UNIQUE KEY,
   venue_city VARCHAR(255) NOT NULL,
   venue_state VARCHAR(255) NOT NULL,
   venue_zipcode INT NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Instrument (
   instrument_id INT AUTO_INCREMENT PRIMARY KEY,
   instrument_name VARCHAR(255) NOT NULL UNIQUE KEY
) ENGINE=InnoDB;

CREATE TABLE Band (
   band_id INT AUTO_INCREMENT PRIMARY KEY,
   band_name VARCHAR(255) NOT NULL UNIQUE KEY,
   band_email VARCHAR(255) NOT NULL UNIQUE KEY
) ENGINE=InnoDB;

CREATE TABLE Band_Member (
   band_member_id INT AUTO_INCREMENT PRIMARY KEY,
   fk_band_id INT NOT NULL,
   fk_musician_id INT NOT NULL,
   FOREIGN KEY (fk_band_id) REFERENCES Band(band_id),
   FOREIGN KEY (fk_musician_id) REFERENCES Musician(musician_id)
) ENGINE=InnoDB;

CREATE TABLE Plays_Instrument (
   plays_instrument_id INT AUTO_INCREMENT PRIMARY KEY,
   fk_band_member_id INT NOT NULL,
   fk_instrument_id INT NOT NULL,
   FOREIGN KEY (fk_band_member_id) REFERENCES Band_Member(band_member_id),
   FOREIGN KEY (fk_instrument_id) REFERENCES Instrument(instrument_id)
) ENGINE=InnoDB;


CREATE TABLE Event (
   event_id INT AUTO_INCREMENT PRIMARY KEY,
   fk_band_id INT NOT NULL,
   fk_venue_id INT NOT NULL,
   fk_client_id INT NOT NULL,
   event_date DATE NOT NULL,
   FOREIGN KEY (fk_band_id) REFERENCES Band(band_id),
   FOREIGN KEY (fk_venue_id) REFERENCES Venue(venue_id),
   FOREIGN KEY (fk_client_id) REFERENCES Client(client_id)
) ENGINE=InnoDB;


INSERT INTO Musician (musician_fname, musician_lname, musician_phone, musician_email)
VALUES ('Lucas', 'Murphey', '(301) 844-1184', 'lucasmurphey@gmail.com');
INSERT INTO Musician (musician_fname, musician_lname, musician_phone, musician_email)
VALUES ('BT', 'Richards', '(301) 243-2342', 'btrichards@gmail.com');
INSERT INTO Musician (musician_fname, musician_lname, musician_phone, musician_email)
VALUES ('Don', 'Harding', '(301) 521-9840', 'donharding@gmail.com');
INSERT INTO Musician (musician_fname, musician_lname, musician_phone, musician_email)
VALUES ('Natasha', 'Moulson', '(240) 843-3309', 'natasham@gmail.com');
INSERT INTO Musician (musician_fname, musician_lname, musician_phone, musician_email)
VALUES ('Benjamin', 'Blocksom', '(240) 211-7845', 'benblocksom@gmail.com');

INSERT INTO Band (band_name, band_email)
VALUES ('ENCORE', 'encore@washingtontalent.com');
INSERT INTO Band (band_name, band_email)
VALUES ('BLACK TIE', 'blacktie@washingtontalent.com');
INSERT INTO Band (band_name, band_email)
VALUES ('SPECTRUM', 'spectrum@washingtontalent.com');

INSERT INTO Venue (venue_name, venue_phone, venue_email, venue_address, venue_city, venue_state, venue_zipcode)
VALUES ('Norbeck Country Club', '(301) 570-4432', 'contact@norbeckcc.com', '25 Norbeck Rd', 'Silver Spring', 'MD', '20906');

INSERT INTO Client (client_fname, client_lname, client_phone, client_email)
VALUES ('John', 'Chesterton', '(240) 112-3786', 'john@syntax.com');

INSERT INTO Instrument (instrument_name)
VALUES ('Saxophone');
INSERT INTO Instrument (instrument_name)
VALUES ('Guitar');
INSERT INTO Instrument (instrument_name)
VALUES ('Piano');
INSERT INTO Instrument (instrument_name)
VALUES ('Bass');
INSERT INTO Instrument (instrument_name)
VALUES ('Voice');

INSERT INTO Band_Member (fk_band_id, fk_musician_id)
VALUES (
   (SELECT band_id from Band WHERE band_name='ENCORE'), 
   (SELECT musician_id from Musician WHERE musician_fname='Lucas' && musician_lname='Murphey')
);

INSERT INTO Band_Member (fk_band_id, fk_musician_id)
VALUES (
   (SELECT band_id from Band WHERE band_name='BLACK TIE'), 
   (SELECT musician_id from Musician WHERE musician_fname='Lucas' && musician_lname='Murphey')
);

INSERT INTO Band_Member (fk_band_id, fk_musician_id)
VALUES (
   (SELECT band_id from Band WHERE band_name='SPECTRUM'), 
   (SELECT musician_id from Musician WHERE musician_fname='Lucas' && musician_lname='Murphey')
);

INSERT INTO Plays_Instrument (fk_band_member_id, fk_instrument_id)
VALUES (
   (SELECT band_member_id from Band_Member WHERE 
      fk_band_id=(SELECT band_id from Band WHERE band_name='ENCORE') &&
      fk_musician_id=(SELECT musician_id from Musician WHERE musician_fname='Lucas' && musician_lname='Murphey')
   ), 
   (SELECT instrument_id from Instrument WHERE instrument_name='Saxophone')
);

INSERT INTO Plays_Instrument (fk_band_member_id, fk_instrument_id)
VALUES (
   (SELECT band_member_id from Band_Member WHERE 
      fk_band_id=(SELECT band_id from Band WHERE band_name='BLACK TIE') &&
      fk_musician_id=(SELECT musician_id from Musician WHERE musician_fname='Lucas' && musician_lname='Murphey')
   ), 
   (SELECT instrument_id from Instrument WHERE instrument_name='Guitar')
);

INSERT INTO Plays_Instrument (fk_band_member_id, fk_instrument_id)
VALUES (
   (SELECT band_member_id from Band_Member WHERE 
      fk_band_id=(SELECT band_id from Band WHERE band_name='SPECTRUM') &&
      fk_musician_id=(SELECT musician_id from Musician WHERE musician_fname='Lucas' && musician_lname='Murphey')
   ), 
   (SELECT instrument_id from Instrument WHERE instrument_name='Piano')
);




