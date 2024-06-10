const Category=require('../../models/categoryModel')
const Product=require('../../models/productModel');
// const { addCategory } = require('../categoryController');


const createCategories=(categories,parentId=null)=>{
    const categoryList=[];
    let category;
    if(parentId==null){
      category=  categories.filter(cat=>cat.parentId==undefined)
    }
    else{
      category=categories.filter(cat=>cat.parentId==parentId)
    }
  
    for (let cats of category){
      categoryList.push({
        _id:cats._id,
        name:cats.name,
        slug:cats.slug,
        parentId:cats.parentId,
        children:createCategories(categories, cats._id)
  
      })
    }
    return categoryList;
  }

  exports.initialData = async (req, res) => {
    try {
      const categories = await Category.find({});
      const products = await Product.find({})
        .select('_id name description productPictures slug price quantity category')
        .populate('category');
  
      if (!categories) {
        return res.status(400).json({ message: "Error while fetching the category." });
      }
      if (!products) {
        return res.status(400).json({ message: "Error while fetching the products." });
      }
  
      res.status(200).json({ products, categories:createCategories(categories) });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };