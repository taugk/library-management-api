const express = require("express");
const MemberController = require("../controllers/memberController");

const router = express.Router();

// Sesuai spesifikasi: POST /api/members (register new member)
router.post("/", MemberController.createMember);

// Sesuai spesifikasi: GET /api/members/:id/borrowings (get borrowing history)
router.get("/:id/borrowings", MemberController.getBorrowingHistory);

// Additional endpoints
router.get("/", MemberController.getAllMembers);
router.get("/:id", MemberController.getMemberById);
router.put("/:id", MemberController.updateMember);
router.delete("/:id", MemberController.deleteMember);

module.exports = router;
