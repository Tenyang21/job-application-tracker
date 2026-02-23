CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(250) NOT NULL,
    password VARCHAR(250) NOT NULL
);

CREATE TABLE applicationtracker (
    user_id INT NOT NULL,
    application_id SERIAL PRIMARY KEY, 
    company_name VARCHAR(50) NOT NULL,
    position VARCHAR(50),
    date_applied DATE NOT NULL,
    statuses VARCHAR(50) NOT NULL,
    incoming_phone DATE, 
    incoming_interview DATE,
    notes VARCHAR(250),
    position VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);