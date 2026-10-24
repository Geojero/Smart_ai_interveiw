const express = require('express');
const protect = require('../middleware/auth');
const {
  getDsaProblems,
  getDsaProblemBySlug,
  runDsaCode,
  submitDsaCode,
  toggleBookmark,
  getProblemSubmissions,
  saveCodeDraft,
} = require('../controllers/dsaController');

const router = express.Router();

router.use(protect);

router.get('/problems', getDsaProblems);
router.get('/problems/:slug', getDsaProblemBySlug);
router.post('/run', runDsaCode);
router.post('/submit', submitDsaCode);
router.post('/bookmark/:problemId', toggleBookmark);
router.get('/submissions/:slug', getProblemSubmissions);
router.post('/save-draft', saveCodeDraft);

module.exports = router;
