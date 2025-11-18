const Borrowing = require("../models/borrowing");
const Book = require("../models/book");
const Member = require("../models/member");
const { pool } = require("../config/database");

class BorrowingService {
  static async getAllBorrowings() {
    try {
      return await Borrowing.findAll();
    } catch (error) {
      throw new Error(`Error fetching borrowings: ${error.message}`);
    }
  }

  static async getBorrowingById(id) {
    try {
      const borrowing = await Borrowing.findById(id);
      if (!borrowing) {
        throw new Error("Borrowing record not found");
      }
      return borrowing;
    } catch (error) {
      throw new Error(`Error fetching borrowing: ${error.message}`);
    }
  }

  static async borrowBook(borrowingData) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { book_id, member_id } = borrowingData;

      console.log("🚀 [SERVICE] Starting borrow process for:", {
        book_id,
        member_id,
      });

      // 1. Verify book exists and has available stock
      const book = await Book.findById(book_id);
      if (!book) {
        throw new Error("Book not found");
      }
      if (book.stock < 1) {
        throw new Error("Book is not available for borrowing (out of stock)");
      }

      // 2. Verify member exists
      const member = await Member.findById(member_id);
      if (!member) {
        throw new Error("Member not found");
      }

      // 3. Check member's current borrowing count (max 3 books)
      const activeBorrowings = await Borrowing.findActiveByMember(member_id);
      if (activeBorrowings.length >= 3) {
        throw new Error(
          "Member has reached the maximum borrowing limit (3 books)"
        );
      }

      // 4. Check if member already has this book borrowed
      const existingBorrowing = await Borrowing.findByBookAndMember(
        book_id,
        member_id
      );
      if (existingBorrowing) {
        throw new Error("Member already has this book borrowed");
      }

      // 5. Set borrow date to current date (sesuai instruksi)
      const borrow_date = new Date().toISOString().split("T")[0];

      console.log("📅 [SERVICE] Borrow date:", borrow_date);

      // 6. Decrease book stock
      await Book.updateStock(book_id, -1, client);

      // 7. Create borrowing record (TANPA due_date)
      const borrowing = await Borrowing.create(
        {
          book_id,
          member_id,
          borrow_date,
          status: "BORROWED",
        },
        client
      );

      await client.query("COMMIT");

      console.log("✅ [SERVICE] Book borrowed successfully");
      return borrowing;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("❌ [SERVICE] Error borrowing book:", error.message);
      throw new Error(`Error borrowing book: ${error.message}`);
    } finally {
      client.release();
    }
  }

  static async returnBook(borrowingId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Verify borrowing record exists
      const borrowing = await Borrowing.findById(borrowingId);
      if (!borrowing) {
        throw new Error("Borrowing record not found");
      }

      // 2. Verify book belongs to member and is currently borrowed
      if (borrowing.status === "RETURNED") {
        throw new Error("Book already returned");
      }

      // 3. Increase book stock
      await Book.updateStock(borrowing.book_id, 1, client);

      // 4. Update borrowing record (set return_date to current date)
      const updatedBorrowing = await Borrowing.update(
        borrowingId,
        {
          return_date: new Date().toISOString().split("T")[0],
          status: "RETURNED",
        },
        client
      );

      await client.query("COMMIT");

      return updatedBorrowing;
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`Error returning book: ${error.message}`);
    } finally {
      client.release();
    }
  }

  static async getOverdueBorrowings() {
    try {
      return await Borrowing.findOverdueBorrowings();
    } catch (error) {
      throw new Error(`Error fetching overdue borrowings: ${error.message}`);
    }
  }

  static async getMemberActiveBorrowings(memberId) {
    try {
      const member = await Member.findById(memberId);
      if (!member) {
        throw new Error("Member not found");
      }

      return await Borrowing.findActiveByMember(memberId);
    } catch (error) {
      throw new Error(`Error fetching active borrowings: ${error.message}`);
    }
  }

  static async getBorrowingStats() {
    try {
      const totalBorrowings = await Borrowing.getTotalCount();
      const activeBorrowings = await Borrowing.getActiveCount();
      const overdueBorrowings = await Borrowing.getOverdueCount();
      const returnedBorrowings = await Borrowing.getReturnedCount();

      return {
        total: totalBorrowings,
        active: activeBorrowings,
        overdue: overdueBorrowings,
        returned: returnedBorrowings,
      };
    } catch (error) {
      throw new Error(`Error fetching borrowing stats: ${error.message}`);
    }
  }
}

module.exports = BorrowingService;
