const { pool } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Borrowing {
  static async findAll() {
    const result = await pool.query(`
      SELECT 
        b.*,
        bk.title as book_title,
        bk.author as book_author,
        bk.isbn as book_isbn,
        m.name as member_name,
        m.email as member_email
      FROM borrowings b
      JOIN books bk ON b.book_id = bk.id
      JOIN members m ON b.member_id = m.id
      ORDER BY b.created_at DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `
      SELECT 
        b.*,
        bk.title as book_title,
        bk.author as book_author,
        bk.isbn as book_isbn,
        m.name as member_name,
        m.email as member_email,
        m.phone as member_phone,
        m.address as member_address
      FROM borrowings b
      JOIN books bk ON b.book_id = bk.id
      JOIN members m ON b.member_id = m.id
      WHERE b.id = $1
    `,
      [id]
    );
    return result.rows[0];
  }
  static async create(borrowingData, client = pool) {
    const {
      book_id,
      member_id,
      borrow_date,
      return_date,
      status = "BORROWED",
    } = borrowingData;
    const id = uuidv4();
    const result = await client.query(
      `INSERT INTO borrowings (id, book_id, member_id, borrow_date, return_date, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, book_id, member_id, borrow_date, return_date, status]
    );
    return result.rows[0];
  }

  static async update(id, borrowingData, client = pool) {
    const { return_date, status } = borrowingData;
    const result = await client.query(
      `UPDATE borrowings SET return_date = $1, status = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 RETURNING *`,
      [return_date, status, id]
    );
    return result.rows[0];
  }

  static async findActiveByMember(memberId, client = pool) {
    const result = await client.query(
      `SELECT * FROM borrowings 
       WHERE member_id = $1 AND status = 'BORROWED'`,
      [memberId]
    );
    return result.rows;
  }

  static async findByBookAndMember(bookId, memberId, client = pool) {
    const result = await client.query(
      `SELECT * FROM borrowings 
       WHERE book_id = $1 AND member_id = $2 AND status = 'BORROWED'`,
      [bookId, memberId]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM borrowings WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async findOverdueBorrowings() {
    const result = await pool.query(`
      SELECT 
        b.*,
        bk.title,
        bk.isbn,
        m.name as member_name,
        m.email,
        (CURRENT_DATE - b.borrow_date) as days_borrowed
      FROM borrowings b
      JOIN books bk ON b.book_id = bk.id
      JOIN members m ON b.member_id = m.id
      WHERE b.status = 'BORROWED' 
      AND (CURRENT_DATE - b.borrow_date) > 30
    `);
    return result.rows;
  }

  static async returnBook(borrowingId) {
    const result = await pool.query(
      `UPDATE borrowings 
       SET return_date = CURRENT_DATE, status = 'RETURNED', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 RETURNING *`,
      [borrowingId]
    );
    return result.rows[0];
  }
}

module.exports = Borrowing;
