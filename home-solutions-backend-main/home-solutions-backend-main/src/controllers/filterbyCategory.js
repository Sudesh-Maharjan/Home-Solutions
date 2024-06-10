// const Category = require("../models/categoryModel");


// exports.filterbycategory = async (req, res) => {
//     try {
//         // Find all categories in the database
//         const categories = await Category.find({});

//         if (!categories) {
//             return res.status(404).json({ message: 'No categories found.' });
//         }

//         // Send the list of categories as a JSON response
//         const categoryList=createCategories(categories);
//         return res.status(200).json({ categoryList });
      
//     }
//     catch (error) {
//         return res.status(500).json({ message: 'Error while getting the list of category.' })
//     }
// }