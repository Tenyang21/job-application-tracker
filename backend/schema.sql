CREATE TABLE ApplicationTracker (
    UserId FOREIGN KEY,
    ApplicationId SERIAL PRIMARY KEY, 
    CompanyName VARCHAR(50) NOT NULL, 
    DateApplied DATE NOT NULL,
    Statuses VARCHAR(50) NOT NULL,
    IncomingPhone DATE, 
    IncomingInterview DATE,
    Notes VARCHAR(250) NOT NULL, 
)