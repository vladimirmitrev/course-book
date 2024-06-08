const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const courseService = require('../services/courseService');

router.get('/', async (req, res) => {
  const latestCourses = await courseService.getLatest().lean();

  res.render('home', { latestCourses });
});

// router.get('/test', isAuth, (req, res) => {
//   res.send('You are authorized')
// })

module.exports = router;
