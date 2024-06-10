const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { default: slugify } = require('slugify');
// const {Sequelize} =require('sequelize')
const {Op} =require('sequelize')
exports.createProduct=async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    let productPictures=[];
    if (req.files && req.files.length>0){
        productPictures=req.files.map(file=>{
            return {img:file.filename}
        });
    }
    // Create a new product in the database
    const newProduct = await Product.create({
      name: req.body.name,
      slug: req.body.slug,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      offers: req.body.offers,
      productPictures: productPictures, 
      category_id: req.body.category_id, 
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create the product' });
  }
}

exports.getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.limit) || 10;

  if (page <= 0 || itemsPerPage <= 0) {
    return res.status(400).json({ message: 'Invalid page or limit parameters.' });
  }

  const skip = (page - 1) * itemsPerPage;
  const searchQuery = req.query.search || '';

  try {
    const products = await Product.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchQuery}%` } },
          { description: { [Op.like]: `%${searchQuery}%` } },
        ],
      },
      include: [
        {
          model: Category,
          as: 'category',
        },
      ],
      offset: skip,
      limit: itemsPerPage,
    });

    if (!products || products.rows.length === 0) {
      return res.status(404).json({ message: 'No products found.' });
    }
    const totalProducts = products.count;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    return res.status(200).json({
      products: products.rows,
      totalProducts: products.count,
      totalPages:totalPages
    });
  

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error while getting the list of products.', error: error });
  }
};

exports.getProductsCount = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    return res.status(200).json( totalProducts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error while getting the product count.', error: error });
  }
};


exports.productDetails = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: 'category', // Use the 'category' alias
    });

    if (!product) {
      return res.status(200).json({ error: 'Product not found145.' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error while getting product details.', error: error });
  }
};


exports.updateProduct = async (req, res) => {
 
  const productId = parseInt(req.params.id);

  try {
    // Find the product by ID
    const productToUpdate = await Product.findByPk(productId);

    if (!productToUpdate) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Define an object to store the fields you want to update
    const updateFields = {};

    // Check if the request body contains data for each field
    if (req.body.name) {
      updateFields.name = req.body.name;
    }
    if (req.body.slug) {
      updateFields.slug = req.body.slug;
    }
    if (req.body.price) {
      updateFields.price = req.body.price;
    }
    if (req.body.quantity) {
      updateFields.quantity = req.body.quantity;
    }
    if (req.body.description) {
      updateFields.description = req.body.description;
    }
    if (req.body.offers) {
      updateFields.offers = req.body.offers;
    }
    
    // let productPictures=[];
    if (req.files && req.files.length>0){
        updateFields.productPictures=req.files.map(file=>{
            return {img:file.filename}
        });
    }


    // Update the category if necessary (assuming you have 'category_id' in the request body)
    if (req.body.category_id) {
      updateFields.category_id = req.body.category_id;
    }

    // Perform the partial update
    await productToUpdate.update(updateFields);

    res.json({ message: 'Product updated successfully', product: productToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update the product' });
  }   
};


exports.getProductsByCategory = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 20; // Your default limit
  try {
    let id = req.params.id;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const childCategories = await Category.findAll({ where: { parentId: id }, attributes: ['id'] });
    const childCategoryIds = [id, ...childCategories.map(category => category.id)];
    const { count: totalProducts } = await Product.findAndCountAll({
      where: { category_id: childCategoryIds },
    });
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    if (totalProducts === 0) {
      return res.status(404).json({ message: 'No products found123' });
    }
    const offset = (page - 1) * itemsPerPage;
    const products = await Product.findAll({
      where: { category_id: childCategoryIds },
      offset,
      limit: itemsPerPage,
    });
    return res.status(200).json({ products, totalProducts, totalPages });
  } catch (error) {
    res.status(200).json({  message: 'Something went wrong' });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.destroy({
      where: { id: productId },
    });

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product with that ID not found.' });
    }

    return res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Error while deleting the product', error: error });
  }
};
