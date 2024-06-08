const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const { isCourseOwner } = require('../middlewares/courseMiddlewares');
const Course = require('../models/Course');
const courseService = require('../services/courseService');
const { getErrorMessage } = require('../utils/errorUtils');


router.get('/', async (req, res) => {
    const courses = await courseService.getAll().lean();

    res.render('courses/catalog', { courses });
});

router.get('/:courseId/details', async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user?._id;
    try {
      const course = await courseService.getOneDetailed(courseId).lean();
      const signedUpUsers = course.singUpList.map(user => user.username).join(', ');
      const isOwner = course.owner && course.owner._id == userId;
      const isSigned = course.singUpList.some(user => user._id == userId);

      res.render('courses/details', { ...course, signedUpUsers, isOwner, isSigned });
    } catch (err) {
      // console.log(err);
      res.redirect('/');
    }
    
});

router.get('/:courseId/sign-up', isAuth, async (req, res) => {
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

router.get('/:courseId/delete', isCourseOwner, async (req, res) => {
    await courseService.delete(req.params.courseId);

    res.redirect('/courses');
});

router.get('/:courseId/edit', isCourseOwner, async (req, res) => {

  res.render(`courses/edit`, { ...req.course });
});

router.post('/:courseId/edit',isCourseOwner, async (req, res) => {
  const courseData = req.body;
  const courseId = req.params.courseId;

  try {
    await courseService.edit(courseId, courseData);

    res.redirect(`/courses/${courseId}/details`);
  } catch (err) {
    
    res.render(`courses/edit`, {...courseData, error: getErrorMessage(err)});
  }
});

module.exports = router;
