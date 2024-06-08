const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const courseService = require('../services/courseService');
const { getErrorMessage } = require('../utils/errorUtils');


router.get('/', async (req, res) => {
    const courses = await courseService.getAll().lean();

    res.render('courses/catalog', { courses });
});

router.get('/:courseId/details', async (req, res) => {
    const courseId = req.params.courseId;
    try {
      const course = await courseService.getOneDetailed(courseId).lean();
      const signedUpUsers = course.singUpList.map(user => user.username).join(', ');

      res.render('courses/details', { ...course, signedUpUsers });
    } catch (err) {
      // console.log(err);
      res.redirect('/');
    }
    
});

router.get('/:courseId/sign-up', async (req, res) => {
  // const courseId = req.params.courseId;
  try {
    await courseService.singUp(req.params.courseId, req.user._id);

    res.redirect(`/courses/${req.params.courseId}/details`);

  } catch (err) {
    // console.log(err);
    res.redirect('/');
  }

});

router.get('/create', isAuth, (req, res) => {
  res.render('courses/create');
});

router.post('/create', isAuth, async (req, res) => {
  const courseData = req.body;
  const userId = req.user._id;

  try {
    await courseService.create(userId, courseData);
    
    res.redirect('/courses');

  } catch (err){
     console.log(err);
     res.render('courses/create', {...courseData, error: getErrorMessage(err)})
  }

  // res.render('courses/create');
});

module.exports = router;
