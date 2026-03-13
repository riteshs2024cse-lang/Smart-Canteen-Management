const express = require('express');
const router = express.Router();
const {
  createFoodLog,
  getAllFoodLogs,
  getFoodLogById,
  updateFoodLog,
  deleteFoodLog
} = require('../controllers/foodController');

// Food log routes
router.post('/', createFoodLog);
router.get('/', getAllFoodLogs);
router.get('/:id', getFoodLogById);
router.put('/:id', updateFoodLog);
router.delete('/:id', deleteFoodLog);

module.exports = router;
