const express = require('express');
const router = express.Router();

// user CRUID

router.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = router;
