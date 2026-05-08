CREATE DATABASE IF NOT EXISTS LibraryManagementDB;
USE LibraryManagementDB;

-- 1. Roles (Lookup table for Users)
CREATE TABLE Roles (
    RoleID INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL,
    Description VARCHAR(255)
);

-- 2. FineTypes (Lookup table for Fines)
CREATE TABLE FineTypes (
    TypeID INT AUTO_INCREMENT PRIMARY KEY,
    TypeName VARCHAR(100) NOT NULL,
    BaseAmount INT NOT NULL,
    Description VARCHAR(255)
);

-- 3. Categories (Lookup table for Books)
CREATE TABLE Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL,
    Description TEXT
);

-- 4. Publishers (Lookup table for Books)
CREATE TABLE Publishers (
    PublisherID INT AUTO_INCREMENT PRIMARY KEY,
    PublisherName VARCHAR(150) NOT NULL,
    Address VARCHAR(255),
    ContactEmail VARCHAR(100),
    Phone VARCHAR(20)
);

-- 5. Authors (Lookup table for Books)
CREATE TABLE Authors (
    AuthorID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    Bio TEXT,
    Nationality VARCHAR(100)
);

-- 6. Users (Base table for Staff and Members)
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL, -- Store hashed passwords!
    FullName VARCHAR(150) NOT NULL,
    Phone VARCHAR(20),
    Status VARCHAR(50),
    RoleID INT,
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

-- 7. Books (Title details)
CREATE TABLE Books (
    BookID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    ISBN VARCHAR(20) UNIQUE,
    Year INT,
    Edition VARCHAR(50),
    Language VARCHAR(50),
    Description TEXT,
    PublisherID INT,
    CategoryID INT,
    FOREIGN KEY (PublisherID) REFERENCES Publishers(PublisherID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

-- 8. BookAuthors (Junction Table for Many-to-Many)
CREATE TABLE BookAuthors (
    BookID INT,
    AuthorID INT,
    PRIMARY KEY (BookID, AuthorID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE,
    FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID) ON DELETE CASCADE
);

-- 9. BookCopies (Physical inventory)
CREATE TABLE BookCopies (
    CopyID INT AUTO_INCREMENT PRIMARY KEY,
    BookID INT,
    Status VARCHAR(50) DEFAULT 'Available',
    ShelfLocation VARCHAR(100),
    AcquisitionDate DATE,
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);

-- 10. Members (Extends Users)
CREATE TABLE Members (
    MemberID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT UNIQUE,
    StudentID VARCHAR(50) UNIQUE,
    Department VARCHAR(100),
    RegistrationDate DATE,
    MaxBooksAllowed INT DEFAULT 5,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- 11. Staff (Extends Users)
CREATE TABLE Staff (
    StaffID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT UNIQUE,
    JobTitle VARCHAR(100),
    EmploymentDate DATE,
    Salary INT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- 12. BorrowingRecords
CREATE TABLE BorrowingRecords (
    BorrowID INT AUTO_INCREMENT PRIMARY KEY,
    MemberID INT,
    CopyID INT,
    BorrowDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    Status VARCHAR(50) DEFAULT 'Borrowed',
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID),
    FOREIGN KEY (CopyID) REFERENCES BookCopies(CopyID)
);

-- 13. Returns
CREATE TABLE Returns (
    ReturnID INT AUTO_INCREMENT PRIMARY KEY,
    BorrowID INT UNIQUE,
    ReturnDate DATE NOT NULL,
    ConditionNote VARCHAR(255), -- renamed from Condition as it's a reserved keyword in some SQL versions
    StaffID INT,
    FOREIGN KEY (BorrowID) REFERENCES BorrowingRecords(BorrowID),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);

-- 14. Reservations
CREATE TABLE Reservations (
    ResID INT AUTO_INCREMENT PRIMARY KEY,
    MemberID INT,
    BookID INT,
    ReservationDate DATE NOT NULL,
    Status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);

-- 15. Fines
CREATE TABLE Fines (
    FineID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    TypeID INT,
    BorrowID INT,
    Amount INT NOT NULL,
    IssuedDate DATE NOT NULL,
    FineStatus VARCHAR(50) DEFAULT 'Unpaid',
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (TypeID) REFERENCES FineTypes(TypeID),
    FOREIGN KEY (BorrowID) REFERENCES BorrowingRecords(BorrowID)
);

-- 16. DamageReports
CREATE TABLE DamageReports (
    ReportID INT AUTO_INCREMENT PRIMARY KEY,
    ReturnID INT,
    Description TEXT,
    Severity VARCHAR(50),
    AssessmentDate DATE,
    StaffID INT,
    FOREIGN KEY (ReturnID) REFERENCES Returns(ReturnID),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);

-- 17. Payments
CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    FineID INT,
    PaymentDate DATE NOT NULL,
    AmountPaid INT NOT NULL,
    PaymentMethod VARCHAR(50),
    TransactionRef VARCHAR(100),
    FOREIGN KEY (FineID) REFERENCES Fines(FineID)
);

-- 18. BookDisposalLog
CREATE TABLE BookDisposalLog (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    CopyID INT,
    Reason VARCHAR(255),
    DateRemoved DATE,
    StaffID INT,
    FOREIGN KEY (CopyID) REFERENCES BookCopies(CopyID),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);