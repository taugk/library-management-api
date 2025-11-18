const Member = require("../models/member");

class MemberService {
  static async getAllMembers() {
    try {
      return await Member.findAll();
    } catch (error) {
      throw new Error(`Error fetching members: ${error.message}`);
    }
  }

  static async getMemberById(id) {
    try {
      const member = await Member.findById(id);
      if (!member) {
        throw new Error("Member not found");
      }
      return member;
    } catch (error) {
      throw new Error(`Error fetching member: ${error.message}`);
    }
  }

  static async createMember(memberData) {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(memberData.email)) {
        throw new Error("Invalid email format");
      }

      // Validate phone format (basic validation)
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(memberData.phone)) {
        throw new Error("Invalid phone number format");
      }

      // Check if email already exists
      const existingMember = await Member.findByEmail(memberData.email);
      if (existingMember) {
        throw new Error("Member with this email already exists");
      }

      return await Member.create(memberData);
    } catch (error) {
      throw new Error(`Error creating member: ${error.message}`);
    }
  }

  static async updateMember(id, memberData) {
    try {
      const member = await Member.findById(id);
      if (!member) {
        throw new Error("Member not found");
      }

      // Validate email format if provided
      if (memberData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(memberData.email)) {
          throw new Error("Invalid email format");
        }
      }

      // Validate phone format if provided
      if (memberData.phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(memberData.phone)) {
          throw new Error("Invalid phone number format");
        }
      }

      // Check if email is being changed and if it already exists
      if (memberData.email && memberData.email !== member.email) {
        const existingMember = await Member.findByEmail(memberData.email);
        if (existingMember) {
          throw new Error("Member with this email already exists");
        }
      }

      return await Member.update(id, memberData);
    } catch (error) {
      throw new Error(`Error updating member: ${error.message}`);
    }
  }

  static async deleteMember(id) {
    try {
      const member = await Member.findById(id);
      if (!member) {
        throw new Error("Member not found");
      }

      return await Member.delete(id);
    } catch (error) {
      throw new Error(`Error deleting member: ${error.message}`);
    }
  }

  static async getBorrowingHistory(
    memberId,
    filters = {},
    page = 1,
    limit = 10
  ) {
    try {
      const member = await Member.findById(memberId);
      if (!member) {
        throw new Error("Member not found");
      }

      return await Member.getBorrowingHistory(
        memberId,
        filters,
        parseInt(page),
        parseInt(limit)
      );
    } catch (error) {
      throw new Error(`Error fetching borrowing history: ${error.message}`);
    }
  }
}

module.exports = MemberService;
