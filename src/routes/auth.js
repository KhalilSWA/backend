const router = require('express').Router();
const { signup, signin } = require('../controllers/auth');
const validation = require('../middlewares/validation');
const userSchema = require('../middlewares/user-schema');

router.post('/signup', validation(userSchema.authSchema, 'body'), signup);
router.post('/signin', validation(userSchema.loginSchema, 'body'), signin);

module.exports = router;