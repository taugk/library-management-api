const MemberService = require("../services/memberService");

class MemberController {
  // GET /api/members
  static async getAllMembers(req, res) {
    try {
      const members = await MemberService.getAllMembers();
      res.json({
        success: true,
        data: members,
        message: "Members retrieved successfully",
        count: members.length,
      });
    } catch (error) {
      console.error("Get all members error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/members/:id
  static async getMemberById(req, res) {
    try {
      const member = await MemberService.getMemberById(req.params.id);
      res.json({
        success: true,
        data: member,
        message: "Member retrieved successfully",
      });
    } catch (error) {
      console.error("Get member by ID error:", error);
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/members
  static async createMember(req, res) {
    try {
      const { name, email, phone, address } = req.body;

      // Validation
      if (!name || !email || !phone || !address) {
        return res.status(400).json({
          success: false,
          message: "Name, email, phone, and address are required",
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      const memberData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
      };

      const member = await MemberService.createMember(memberData);

      res.status(201).json({
        success: true,
        data: member,
        message: "Member created successfully",
      });
    } catch (error) {
      console.error("Create member error:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // PUT /api/members/:id
  static async updateMember(req, res) {
    try {
      const { name, email, phone, address } = req.body;

      // Validation
      if (!name || !email || !phone || !address) {
        return res.status(400).json({
          success: false,
          message: "Name, email, phone, and address are required",
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      const memberData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
      };

      const member = await MemberService.updateMember(
        req.params.id,
        memberData
      );

      res.json({
        success: true,
        data: member,
        message: "Member updated successfully",
      });
    } catch (error) {
      console.error("Update member error:", error);
      const statusCode = error.message.includes("not found") ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE /api/members/:id
  static async deleteMember(req, res) {
    try {
      await MemberService.deleteMember(req.params.id);
      res.json({
        success: true,
        message: "Member deleted successfully",
      });
    } catch (error) {
      console.error("Delete member error:", error);
      const statusCode = error.message.includes("not found") ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/members/:id/borrowing-history
  static async getBorrowingHistory(req, res) {
    try {
      const history = await MemberService.getBorrowingHistory(req.params.id);
      res.json({
        success: true,
        data: history,
        message: "Borrowing history retrieved successfully",
        count: history.length,
      });
    } catch (error) {
      console.error("Get borrowing history error:", error);
      const statusCode = error.message.includes("not found") ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/members/:id/active-borrowings
  static async getActiveBorrowings(req, res) {
    try {
      const borrowings = await MemberService.getActiveBorrowings(req.params.id);
      res.json({
        success: true,
        data: borrowings,
        message: "Active borrowings retrieved successfully",
        count: borrowings.length,
      });
    } catch (error) {
      console.error("Get active borrowings error:", error);
      const statusCode = error.message.includes("not found") ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/members/search?query=...
  static async searchMembers(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const members = await MemberService.searchMembers(query);
      res.json({
        success: true,
        data: members,
        message: "Members search completed successfully",
        count: members.length,
      });
    } catch (error) {
      console.error("Search members error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = MemberController;
