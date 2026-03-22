const express = require('express');
const router = express.Router();
const { runAnalysis, getHistory, deleteHistoryItem } = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, runAnalysis);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteHistoryItem);

module.exports = router;
