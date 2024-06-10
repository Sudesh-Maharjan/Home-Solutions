const Category = require('../models/categoryModel'); 
const slugify = require('slugify'); 

const createCategoryTree = async (parentId = null) => {
  const categories = await Category.findAll({ where: { parentId } });

  const categoryList = [];
  for (const category of categories) {
    categoryList.push({
      _id: category.id,
      name: category.name,
      slug: category.slug,
      children: await createCategoryTree(category.id),
    });
  }

  return categoryList;
};


exports.addCategory = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    console.log(name,parentId)

    // Generate a unique slug based on the category name
    const slug = slugify(name, {
      replacement: '-', // Replace spaces with a dash
      lower: true, // Convert to lowercase
    });

    // Check if the specified parent category (if any) exists
    if (parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        return res.status(400).json({
          message: 'Parent category does not exist.',
        });
      }
    }

    const newCategory = await Category.create({
      name,
      slug,
      parentId: parentId || null, // Set parentId to null if it's not provided
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: newCategory,
    });
    console.log(newCategory)
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Failed to create category',
      error: error.message,
    });
  }
};


// Get the count of categories
exports.getCategoryCount = async (req, res) => {
  try {
    const totalCategory = await Category.count();

    return res.status(200).json(totalCategory);
  } catch (error) {
    return res.status(500).json({
      message: 'Error while getting the category count',
      error: error.message,
    });
  }
};

// Get a list of categories
exports.getCategories = async (req, res) => {
  try {
    // Call the recursive function to build the category tree
    const categoryList = await createCategoryTree();

    return res.status(200).json({ categoryList });
  } catch (error) {
    return res.status(500).json({
      message: 'Error while getting the list of categories',
      error: error.message,
    });
  }
};

// Get category details by ID
exports.categoryDetails = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(400).json({
        error: 'Category not found',
      });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({
      error: 'An error occurred while retrieving the category details',
    });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const newName = req.body.name;

    const updatedCategory = await Category.update(
      { name: newName },
      { where: { id: categoryId } }
    );

    if (!updatedCategory) {
      return res.status(400).json({
        error: 'Category not found',
      });
    }

    return res.status(200).json({
      message: 'Category updated successfully',
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Something went wrong while updating the category',
    });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.destroy({ where: { id: categoryId } });

    if (!deletedCategory) {
      return res.status(400).json({
        error: 'Category not found',
      });
    }

    return res.status(200).json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while deleting the category',
      error: error.message,
    });
  }
};
