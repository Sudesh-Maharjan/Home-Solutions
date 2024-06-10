const express = require('express');
const router=express.Router()

const upload= require('../middlewares/file-upload');
const { createBlog, deleteBlog, getBlogs, blogDetails, updateBlog, getBlogsCount } = require('../controllers/blogController');

router.post('/createblog' , upload.single('blogPic') ,createBlog)
router.delete('/deleteblog/:id', deleteBlog)
router.get('/bloglist', getBlogs)
router.get('/blogdetails/:id', blogDetails)
router.put('/updateblog/:id' , upload.single('blogPic'), updateBlog)
router.get('/blogcount', getBlogsCount)
module.exports = router;
