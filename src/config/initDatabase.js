const { Pool } = require("pg");
require("dotenv").config();

const initDatabase = async () => {
  // First, connect to default postgres database to create our database
  const initPool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres", // Connect to default postgres database first
  });

  let client;
  try {
    client = await initPool.connect();

    // Check if database exists
    const dbCheck = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME]
    );

    // Create database if it doesn't exist
    if (dbCheck.rows.length === 0) {
      console.log(`Creating database: ${process.env.DB_NAME}`);
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log("✅ Database created successfully");
    } else {
      console.log(`✅ Database ${process.env.DB_NAME} already exists`);
    }

    client.release();
    await initPool.end();

    // Now connect to the target database
    const targetPool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    const targetClient = await targetPool.connect();

    // Enable UUID extension
    await targetClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create tables with exact schema from requirements
    await targetClient.query(`
      CREATE TABLE IF NOT EXISTS books (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        published_year INTEGER NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        isbn VARCHAR(13) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await targetClient.query(`
      CREATE TABLE IF NOT EXISTS members (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await targetClient.query(`
      CREATE TABLE IF NOT EXISTS borrowings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        borrow_date DATE NOT NULL,
        return_date DATE,
        status VARCHAR(20) DEFAULT 'BORROWED' CHECK (status IN ('BORROWED', 'RETURNED')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await targetClient.query(`
      CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
      CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
      CREATE INDEX IF NOT EXISTS idx_books_published_year ON books(published_year);
      CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
      CREATE INDEX IF NOT EXISTS idx_members_name ON members(name);
      CREATE INDEX IF NOT EXISTS idx_borrowings_book_id ON borrowings(book_id);
      CREATE INDEX IF NOT EXISTS idx_borrowings_member_id ON borrowings(member_id);
      CREATE INDEX IF NOT EXISTS idx_borrowings_status ON borrowings(status);
      CREATE INDEX IF NOT EXISTS idx_borrowings_borrow_date ON borrowings(borrow_date);
      CREATE INDEX IF NOT EXISTS idx_borrowings_return_date ON borrowings(return_date);
    `);

    console.log("✅ Tables and indexes created successfully");

    // Insert sample data (optional)
    await insertSampleData(targetClient);

    targetClient.release();
    await targetPool.end();

    console.log("🎉 Database initialization completed successfully!");
  } catch (error) {
    console.error("❌ Database initialization error:", error.message);
    if (client) client.release();
    if (initPool) await initPool.end();
    process.exit(1);
  }
};

// Optional: Insert sample data
const insertSampleData = async (client) => {
  try {
    // Check if sample data already exists
    const bookCheck = await client.query("SELECT COUNT(*) FROM books");
    const memberCheck = await client.query("SELECT COUNT(*) FROM members");

    if (
      parseInt(bookCheck.rows[0].count) === 0 &&
      parseInt(memberCheck.rows[0].count) === 0
    ) {
      console.log("📝 Inserting sample data...");

      // Insert sample books
      await client.query(`
        INSERT INTO books (title, author, published_year, stock, isbn) VALUES
        ('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 5, '9780743273565'),
        ('To Kill a Mockingbird', 'Harper Lee', 1960, 3, '9780061120084'),
        ('1984', 'George Orwell', 1949, 4, '9780451524935'),
        ('Pride and Prejudice', 'Jane Austen', 1813, 6, '9780141439518'),
        ('The Hobbit', 'J.R.R. Tolkien', 1937, 2, '9780547928227')
        ON CONFLICT (isbn) DO NOTHING
      `);

      // Insert sample members
      await client.query(`
        INSERT INTO members (name, email, phone, address) VALUES
        ('John Smith', 'john.smith@email.com', '+1234567890', '123 Main St, New York, NY'),
        ('Maria Garcia', 'maria.garcia@email.com', '+0987654321', '456 Oak Ave, Los Angeles, CA'),
        ('David Johnson', 'david.johnson@email.com', '+1122334455', '789 Pine Rd, Chicago, IL')
        ON CONFLICT (email) DO NOTHING
      `);

      console.log("✅ Sample data inserted successfully");
    } else {
      console.log(
        "📊 Database already contains data, skipping sample data insertion"
      );
    }
  } catch (error) {
    console.log("⚠️  Could not insert sample data:", error.message);
  }
};

// Run the initialization
initDatabase();
