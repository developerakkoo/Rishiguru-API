const express = require('express');

const blogController = require('../../Controller/blog/blogController');

const router = express.Router();

router.get('/blog', blogController.getAllBlogPosts);
router.get('/blog/:id', blogController.getPostById);

router.post('/blog', blogController.postblog);

router.delete('/blog/:id', blogController.deletePost);

module.exports = router;