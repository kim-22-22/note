const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.get("/", verifyToken, (req, res) => {
    res.json({message: "Accès autorisé", userId: req.user.id});
});

module.exports = router;