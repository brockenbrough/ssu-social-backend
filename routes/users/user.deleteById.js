const express = require('express');
const router = express.Router();
const newUserModel = require("../../models/userModel");

router.delete('/user/deleteById/:verifiedId/:id', async (req, res) => {
  
    const { id: userId } = req.params;  // Retrieve userId from URL params
    const { verifiedId: verifiedUserId } = req.params;

    try {
      // Verify that the userId exists in the database
      const verifiedUser = await newUserModel.findById(verifiedUserId);
      if (!verifiedUser) {
        return res.status(404).json({ message: "Verified ID not found" });
      }

      // Proceed to delete the user
      const deletedUser = await newUserModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
