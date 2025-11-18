-- Library Management System Sample Data

-- Insert sample books
INSERT INTO books (title, author, published_year, stock, isbn) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 5, '9780743273565'),
('To Kill a Mockingbird', 'Harper Lee', 1960, 3, '9780061120084'),
('1984', 'George Orwell', 1949, 4, '9780451524935'),
('Pride and Prejudice', 'Jane Austen', 1813, 6, '9780141439518'),
('The Hobbit', 'J.R.R. Tolkien', 1937, 2, '9780547928227'),
('The Catcher in the Rye', 'J.D. Salinger', 1951, 4, '9780316769488'),
('The Lord of the Rings', 'J.R.R. Tolkien', 1954, 3, '9780544003415'),
('Harry Potter and the Philosopher''s Stone', 'J.K. Rowling', 1997, 8, '9780747532743'),
('The Da Vinci Code', 'Dan Brown', 2003, 5, '9780307474278'),
('The Alchemist', 'Paulo Coelho', 1988, 7, '9780061122415');

-- Insert sample members
INSERT INTO members (name, email, phone, address) VALUES
('John Smith', 'john.smith@email.com', '+1234567890', '123 Main St, New York, NY'),
('Maria Garcia', 'maria.garcia@email.com', '+0987654321', '456 Oak Ave, Los Angeles, CA'),
('David Johnson', 'david.johnson@email.com', '+1122334455', '789 Pine Rd, Chicago, IL'),
('Sarah Williams', 'sarah.williams@email.com', '+5566778899', '321 Elm St, Houston, TX'),
('Michael Brown', 'michael.brown@email.com', '+4433221100', '654 Maple Dr, Phoenix, AZ');

-- Insert sample borrowings
INSERT INTO borrowings (book_id, member_id, borrow_date, return_date, status) 
SELECT 
    (SELECT id FROM books WHERE title = 'The Great Gatsby'),
    (SELECT id FROM members WHERE name = 'John Smith'),
    '2024-01-01',
    '2024-01-15',
    'RETURNED'
WHERE NOT EXISTS (SELECT 1 FROM borrowings WHERE book_id = (SELECT id FROM books WHERE title = 'The Great Gatsby') AND member_id = (SELECT id FROM members WHERE name = 'John Smith'));

INSERT INTO borrowings (book_id, member_id, borrow_date, return_date, status) 
SELECT 
    (SELECT id FROM books WHERE title = '1984'),
    (SELECT id FROM members WHERE name = 'Maria Garcia'),
    '2024-01-10',
    NULL,
    'BORROWED'
WHERE NOT EXISTS (SELECT 1 FROM borrowings WHERE book_id = (SELECT id FROM books WHERE title = '1984') AND member_id = (SELECT id FROM members WHERE name = 'Maria Garcia'));

INSERT INTO borrowings (book_id, member_id, borrow_date, return_date, status) 
SELECT 
    (SELECT id FROM books WHERE title = 'The Hobbit'),
    (SELECT id FROM members WHERE name = 'David Johnson'),
    '2024-01-05',
    '2024-01-20',
    'RETURNED'
WHERE NOT EXISTS (SELECT 1 FROM borrowings WHERE book_id = (SELECT id FROM books WHERE title = 'The Hobbit') AND member_id = (SELECT id FROM members WHERE name = 'David Johnson'));

INSERT INTO borrowings (book_id, member_id, borrow_date, return_date, status) 
SELECT 
    (SELECT id FROM books WHERE title = 'Pride and Prejudice'),
    (SELECT id FROM members WHERE name = 'Sarah Williams'),
    '2024-01-12',
    NULL,
    'BORROWED'
WHERE NOT EXISTS (SELECT 1 FROM borrowings WHERE book_id = (SELECT id FROM books WHERE title = 'Pride and Prejudice') AND member_id = (SELECT id FROM members WHERE name = 'Sarah Williams'));