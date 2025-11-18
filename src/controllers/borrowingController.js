const BorrowingService = require("../services/borrowingService");

class BorrowingController {
  static async getAllBorrowings(req, res) {
    try {
      const borrowings = await BorrowingService.getAllBorrowings();
      res.json({
        success: true,
        data: borrowings,
        message: "Borrowings retrieved successfully",
        count: borrowings.length,
      });
    } catch (error) {
      console.error("Get all borrowings error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getBorrowingById(req, res) {
    try {
      const borrowing = await BorrowingService.getBorrowingById(req.params.id);
      res.json({
        success: true,
        data: borrowing,
        message: "Borrowing record retrieved successfully",
      });
    } catch (error) {
      console.error("Get borrowing by ID error:", error);
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async borrowBook(req, res) {
    try {
      const { book_id, member_id, borrow_date } = req.body;

      // Validation
      if (!book_id || !member_id) {
        return res.status(400).json({
          success: false,
          message: "Book ID and Member ID are required",
        });
      }

      const borrowingData = {
        book_id: book_id.trim(),
        member_id: member_id.trim(),
        borrow_date: borrow_date || new Date().toISOString().split("T")[0],
      };

      const borrowing = await BorrowingService.borrowBook(borrowingData);

      res.status(201).json({
        success: true,
        data: borrowing,
        message: "Book borrowed successfully",
      });
    } catch (error) {
      console.error("Borrow book error:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async returnBook(req, res) {
    try {
      const borrowing = await BorrowingService.returnBook(req.params.id);
      res.json({
        success: true,
        data: borrowing,
        message: "Book returned successfully",
      });
    } catch (error) {
      console.error("Return book error:", error);
      const statusCode = error.message.includes("not found") ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getOverdueBorrowings(req, res) {
    try {
      const borrowings = await BorrowingService.getOverdueBorrowings();
      res.json({
        success: true,
        data: borrowings,
        message: "Overdue borrowings retrieved successfully",
        count: borrowings.length,
      });
    } catch (error) {
      console.error("Get overdue borrowings error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getMemberActiveBorrowings(req, res) {
    try {
      const borrowings = await BorrowingService.getMemberActiveBorrowings(
        req.params.memberId
      );
      res.json({
        success: true,
        data: borrowings,
        message: "Member active borrowings retrieved successfully",
        count: borrowings.length,
      });
    } catch (error) {
      console.error("Get member active borrowings error:", error);
      const statusCode = error.message.includes("not found") ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getBorrowingStats(req, res) {
    try {
      const stats = await BorrowingService.getBorrowingStats();
      res.json({
        success: true,
        data: stats,
        message: "Borrowing statistics retrieved successfully",
      });
    } catch (error) {
      console.error("Get borrowing stats error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = BorrowingController;
