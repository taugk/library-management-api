const { pool } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Member {
  static async findAll() {
    const result = await pool.query(`
      SELECT * FROM members ORDER BY created_at DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM members WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM members WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async create(memberData) {
    const { name, email, phone, address } = memberData;
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO members (id, name, email, phone, address) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, name, email, phone, address]
    );
    return result.rows[0];
  }

  static async update(id, memberData) {
    const { name, email, phone, address } = memberData;
    const result = await pool.query(
      `UPDATE members SET name = $1, email = $2, phone = $3, address = $4, 
       updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *`,
      [name, email, phone, address, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM members WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async getBorrowingHistory(
    memberId,
    filters = {},
    page = 1,
    limit = 10
  ) {
    const { status } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        b.*,
        bk.title,
        bk.author,
        bk.isbn,
        (b.due_date < CURRENT_DATE AND b.status = 'BORROWED') as is_overdue
      FROM borrowings b
      JOIN books bk ON b.book_id = bk.id
      WHERE b.member_id = $1
    `;

    const queryParams = [memberId];
    let count = 1;

    if (status) {
      count++;
      query += ` AND b.status = $${count}`;
      queryParams.push(status.toUpperCase());
    }

    // Count query
    const countQuery = `SELECT COUNT(*) FROM (${query}) as count_query`;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Main query with pagination
    query += ` ORDER BY b.borrow_date DESC LIMIT $${count + 1} OFFSET $${
      count + 2
    }`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);
    const totalPages = Math.ceil(total / limit);

    return {
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
      },
    };
  }
}

module.exports = Member;
