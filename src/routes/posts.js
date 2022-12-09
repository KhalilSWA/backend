const router = require('express').Router();
const isAuth = require('../middlewares/verification');
const validation = require('../middlewares/validation');
const postSchema = require('../middlewares/post-schema');
const { createPost, getPost, updatePost, deletePost, loadPosts, uploadPictures } = require('../controllers/posts');
const { likePost } = require('../controllers/likes');

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', isAuth, validation(postSchema.postSchema, 'body'), createPost);
router.post('/:post_id/pictures', isAuth, upload.array('pictures'), uploadPictures);
router.post('/:post_id/like', isAuth, likePost);

router.get('/', isAuth, loadPosts);
router.get('/:post_id', isAuth, getPost);

router.put('/:post_id', isAuth, validation(postSchema.updateSchema, 'body'), updatePost);

router.delete('/:post_id', isAuth, deletePost);

module.exports = router;