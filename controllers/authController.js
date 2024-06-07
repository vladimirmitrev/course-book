const router = require('express').Router();
const authService = require('../services/authService');
const { getErrorMessage } = require('../utils/errorUtils');

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const userData = req.body;

    try {
      const token = await authService.register(userData);
  
      res.cookie('auth', token);
      res.redirect('/');

    } catch (err) {
      // const errorMessage = getErrorMessage(err);
      res.render('auth/register', {error: getErrorMessage(err), ...userData});
    }

})

router.get('/login', (req, res) => {
    res.render('auth/login');
  });

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
      const token = await authService.login(email, password);

      res.cookie('auth', token);
      //ToDo Check where to redirect after login
      res.redirect('/');
    } catch (err) {
      res.render('auth/login', {error: getErrorMessage(err), ...req.body});
    }
  });

router.get('/logout', (req, res) => {
  res.clearCookie('auth');
  
  res.redirect('/');
})
module.exports = router;
