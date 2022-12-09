const router = require('express').Router();
const isAuth = require('../middlewares/verification');
const validation = require('../middlewares/validation');
const userSchema = require('../middlewares/user-schema');
const { uploadProfilePicture, getProfile, updateProfile } = require('../controllers/user');

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/picture', isAuth, upload.single('picture'), uploadProfilePicture);
router.put('/', isAuth, validation(userSchema.updateSchema, 'body'), updateProfile);
router.get('/', isAuth, getProfile);

module.exports = router;