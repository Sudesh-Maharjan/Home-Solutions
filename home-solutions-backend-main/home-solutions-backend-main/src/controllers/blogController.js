const Blog = require('../models/blogModel');
// Create a blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const newBlog = await Blog.create({
      title,
      content,
      blogPic: req.file.filename
    });

    if (!newBlog) {
      return res.status(400).json({ error: 'Failed to create the blog.' });
    }

    res.status(201).json({ message: 'Blog created successfully.', blog: newBlog });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Sorry, can\'t create the blog', error });
  }
};

// Get a list of blogs
exports.getBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.limit) || 100;

  if (page <= 0 || itemsPerPage <= 0) {
    return res.status(400).json({ message: 'Invalid page or limit parameters.' });
  }

  const offset = (page - 1) * itemsPerPage;

  try {
 
    const blogs = await Blog.findAll({
      attributes: ['title', 'content', 'blogPic', 'createdAt', 'updatedAt','id'],
      offset,  // Add the offset and limit options here
      limit: itemsPerPage,
    });
    

    const totalBlogs = await Blog.count();
    const totalPages = Math.ceil(totalBlogs / itemsPerPage);

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: 'No blogs found.' });
    }

    return res.status(200).json({ blogs, totalBlogs, totalPages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error while getting the list of blogs.' });
  }
};

// Get the total number of blogs
exports.getBlogsCount = async (req, res) => {
  try {
    const totalBlogs = await Blog.count();
    return res.status(200).json(totalBlogs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error while getting the blog count.' });
  }
};

// Get blog details by ID
exports.blogDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error while getting blog details." });
  }
};

// Update a blog by ID
exports.updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blogPic = req.file ? req.file.filename: null;
    const blogId = req.params.id;

    const blogToUpdate = await Blog.findByPk(blogId);

    if (!blogToUpdate) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    blogToUpdate.title = title;
    blogToUpdate.content = content;

    if (blogPic) {
      blogToUpdate.blogPic = blogPic;
    }

    await blogToUpdate.save();

    res.status(200).json({ message: 'Blog post updated successfully', blog: blogToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update the blog post' });
  }
};


// Delete a blog by ID
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    // Check if the blog exists before attempting to delete
    const existingBlog = await Blog.findByPk(blogId);

    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    const deletedRows = await Blog.destroy({ where: { id: blogId } });

    if (deletedRows === 0) {
      return res.status(500).json({ error: 'Error while deleting the blog.' });
    }

    return res.status(200).json({ message: 'Blog deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error while deleting the blog.' });
  }
};

