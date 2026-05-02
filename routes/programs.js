const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const auth = require('../middleware/auth');

router.post('/', auth, programController.createProgram);
router.get('/', auth, programController.getPrograms);
router.get('/leaderboard', programController.getLeaderboard);
router.get('/:slug', programController.getProgramBySlug);
router.put('/:id', auth, programController.updateProgram);
router.delete('/:id', auth, programController.deleteProgram);

module.exports = router;
