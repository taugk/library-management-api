const { pool } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Book {
  static async findAll() {
    const result = await pool.query(`
      SELECT * FROM books ORDER BY created_at DESC
    `);
    return result.rows;
  }

  static async findWithQuery(query, params = []) {
    try {
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error("Query error:", error);
      throw error;
    }
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    return result.rows[0];
  }

  static async findByISBN(isbn) {
    const result = await pool.query("SELECT * FROM books WHERE isbn = $1", [
      isbn,
    ]);
    return result.rows[0];
  }

  static async create(bookData) {
    const { title, author, published_year, stock = 0, isbn } = bookData;
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO books (id, title, author, published_year, stock, isbn) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, title, author, published_year, stock, isbn]
    );
    return result.rows[0];
  }

  static async update(id, bookData) {
    const { title, author, published_year, stock, isbn } = bookData;
    const result = await pool.query(
      `UPDATE books SET title = $1, author = $2, published_year = $3, stock = $4, 
       isbn = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`,
      [title, author, published_year, stock, isbn, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async updateStock(bookId, change, client = pool) {
    const result = await client.query(
      "UPDATE books SET stock = stock + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [change, bookId]
    );
    return result.rows[0];
  }

  static async getAvailableBooks() {
    const result = await pool.query(
      "SELECT * FROM books WHERE stock > 0 ORDER BY title"
    );
    return result.rows;
  }
}

module.exports = Book;
