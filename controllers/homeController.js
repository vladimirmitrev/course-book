const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const courseService = require('../services/courseService');
const userService = require('../services/userService');

router.get('/', async (req, res) => {
  const latestCourses = await courseService.getLatest().lean();

  res.render('home', { latestCourses });
});

router.get('/profile', isAuth, async (req, res) => {
  const user = await userService.getInfo(req.user._id).lean();

  const createdCoursesCount = user.createdCourses.length;
  const singedUpCoursesCount = user.singedUpCourses.length;
  
  res.render('profile', { user, createdCoursesCount, singedUpCoursesCount });
});
// router.get('/test', isAuth, (req, res) => {
//   res.send('You are authorized')
// })

module.exports = router;
