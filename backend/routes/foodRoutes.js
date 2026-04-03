const express = require('express');
const router = express.Router();
const {
  createFoodLog,
  getAllFoodLogs,
  getFoodLogById,
  updateFoodLog,
  deleteFoodLog
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

// Food log routes
router.post('/', createFoodLog);
router.get('/', getAllFoodLogs);
router.get('/:id', getFoodLogById);
router.put('/:id', updateFoodLog);
router.delete('/:id', deleteFoodLog);

module.exports = router;
