import { Router } from "express";
import Collection from "../models/Collection.js";
import Color from "../models/Color.js";
import Image from "../models/Image.js";
import Product from "../models/Product.js";
import ProductCollection from "../models/ProductCollection.js";
import ProductColor from "../models/ProductColor.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";
import ProductCategory from "../models/ProductCategory.js";
import { Op } from "sequelize";


const productRoute = Router()


productRoute.get("/", async (req, res) => {
  const products = 
  {
    rows: null,
    count: 0
  }
    try {
      // product here will contain 2 attributes /count/ representing the number of rows matching the query 
      // and another attribute /rows/ containing the data matching the query
 switch (req.query.filterBy) {
  case req.query.filterBy = "Colors":
    products.rows = await Product.findAll({
      include: [
        { model: Color, as: "Colors", 
        where:{
          Name: req.query.filterValue
        }},
        { model: Collection, as: "Collections" },
        { model: Category, as: "Categories" },
        { model: Review },
        { model: Image },
      ],
      offset: Number(req.query.offSet),
      limit:  Number(req.query.limit),
      order: [
        [req.query.sortBy, req.query.sortDir]
      ],
    });


    products.count = await Product.count();
    res.json(products);  
    break;
    case  req.query.filterBy = "Collections":
      products.rows = await Product.findAll({
        include: [
        { model: Color, as: "Colors" },
        { model: Collection, as: "Collections",
        where:{
          Name: req.query.filterValue
        }},
        { model: Category, as: "Categories" },
        { model: Review },
        { model: Image },
      ],
      offset: Number(req.query.offSet),
      limit: Number(req.query.limit),
      order: [
        [req.query.sortBy, req.query.sortDir]
      ],
    });
    

    products.count = await Product.count();
    res.json(products);  
    break;
    case  req.query.filterBy = "Categories":
      products.rows = await Product.findAll({
        include: [
        { model: Color, as: "Colors" },
        { model: Collection, as: "Collections"},
        { model: Category, as: "Categories",
        where:{
          Name: req.query.filterValue
        }},
        { model: Review },
        { model: Image },
      ],
      offset: Number(req.query.offSet),
      limit: Number(req.query.limit),
      order: [
        [req.query.sortBy, req.query.sortDir]
      ],
    });


    products.count = await Product.count();
    res.json(products);  
    break;
    case req.query.filterBy = "Search":
      products.rows = await Product.findAll({
        include: [
        { model: Color, as: "Colors" },
        { model: Collection, as: "Collections"},
        { model: Category, as: "Categories"},
        { model: Review },
        { model: Image },
      ],
      offset: Number(req.query.offSet),
      limit: Number(req.query.limit),
      where:{Name: {[Op.substring]: req.query.filterValue}},
      order: [
        [req.query.sortBy, req.query.sortDir]
      ],
    });


    products.count = await Product.count({
      where:{
        Name: {[Op.substring]: req.query.filterValue}      
      }
    });
    res.json(products);  
    break;
  default:
    products.rows = await Product.findAll({
        include: [
        { model: Color, as: "Colors" },
        { model: Collection, as: "Collections" },
        { model: Category, as: "Categories" },
        { model: Review },
        { model: Image },
      ],
      offset: Number(req.query.offSet),
      limit: Number(req.query.limit),
      order: [
        [req.query.sortBy, req.query.sortDir]
      ],
    });
    products.count = await Product.count();
    res.json(products);  
    break;
 }

    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Error getting products" + error });
    }
  });


  productRoute.get("/:id", async (req, res) => {
    try {
      let product;
      //find by pk = find by primary key so we find the item with the enter
        product = await Product.findByPk(req.params.id,{
            include: [
                { model: Color, as: "Colors" },
                { model: Collection, as: "Collections" },
                { model: Category, as: "Categories" },
                { model: Review },
                { model: Image },
            ]       
        });  
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Error getting products" });
    }
  });



//NEEDS A BETTER 'WHERE'! V
productRoute.post("/", async (req, res) => {
try {
    const newProduct = req.body;
    const [product, created] = await Product.findOrCreate({
    where: {
        Name: newProduct.Name,
        Price: newProduct.Price,
        Description: newProduct.Description,
        Stock: newProduct.Stock,
    },
    });
    if (created) {
      if (newProduct.Colors) {
        await ProductColor.destroy({
            where: {
            product_id: product.ID,
            },
        });
        newProduct.Colors.forEach(async (color) => {
            await ProductColor.findOrCreate({
            where: {
                product_id: product.ID,
                color_id: color,
            },
            });
        });
        }
        if (newProduct.Collections) {
        await ProductCollection.destroy({
            where: {
            product_id: product.ID,
            },
        });
        newProduct.Collections.forEach(async (collection) => {
            await ProductCollection.findOrCreate({
            where: {
                product_id: product.ID,
                collection_id: collection,
            },
            });
        });
        }
        if (newProduct.Categories) {
        await ProductCategory.destroy({
            where: {
            product_id: product.ID,
            },
        });
        newProduct.Categories.forEach(async (category) => {
            await ProductCategory.findOrCreate({
            where: {
                product_id: product.ID,
                category_id: category,
            },
            });
        });
        }
    
        if(newProduct.Reviews){
          newProduct.Reviews.forEach(async (review) => {
            await Review.findOrCreate({
            where: {
              ID: Math.floor(Math.random() * 100000000),
              Reviewer: review.Reviewer,
              Rating: review.Rating,
              Text: review.Text,
              ProductID: req.params.id
            },
            });
        });
    
        }
        
    res.json(product);
    } else {
    res.status(500).json({ error: "An Identical product already exists!" });
    }
} catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal Server Error CREATE PRODUCT" });
}
});

productRoute.put("/:id", async (req, res) => {
const newProduct = req.body;
try {
    const product = await Product.update(
    {
        Name: newProduct.Name,
        Price: newProduct.Price,
        Description: newProduct.Description,
        Stock: newProduct.Stock,
    },
    {
        where: {
        ID: req.params.id,
        },
    }
    );
    if (newProduct.Colors) {
    await ProductColor.destroy({
        where: {
        product_id: req.params.id,
        },
    });
    newProduct.Colors.forEach(async (color) => {
        await ProductColor.findOrCreate({
        where: {
            product_id: req.params.id,
            color_id: color,
        },
        });
    });
    }
    if (newProduct.Collections) {
    await ProductCollection.destroy({
        where: {
        product_id: req.params.id,
        },
    });
    newProduct.Collections.forEach(async (collection) => {
        await ProductCollection.findOrCreate({
        where: {
            product_id: req.params.id,
            collection_id: collection,
        },
        });
    });
    }
    if (newProduct.Categories) {
    await ProductCategory.destroy({
        where: {
        product_id: req.params.id,
        },
    });
    newProduct.Categories.forEach(async (category) => {
        await ProductCategory.findOrCreate({
        where: {
            product_id: req.params.id,
            category_id: category,
        },
        });
    });
    }

    if(newProduct.Reviews){
      newProduct.Reviews.forEach(async (review) => {
        await Review.findOrCreate({
        where: {
          ID: Math.floor(Math.random() * 100000000),
          Reviewer: review.Reviewer,
          Rating: review.Rating,
          Text: review.Text,
          ProductID: req.params.id
        },
        });
    });

    }


    res.json(product);
} catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error UPDATE PRODUCT" });
}
});

productRoute.delete("/:id", async (req, res) => {
try {
    const product = await Product.destroy({
    where: {
        ID: req.params.id,
    },
    });

    res.json(product);
} catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error DELETE PRODUCT" });
}
});

// TODO: dont forget to fix this later
productRoute.put("/:id/stock", async (req, res) => {
  const newStock = req.body.Stock
  try {
      const product = await Product.update(
        {
          Stock: newStock,
      },
      {
          where: {
          ID: req.params.id,
          },
      });
  
      res.json(product);
  } catch (error) {
      console.error("Error updating stock:", error);
      res.status(500).json({ error: "Internal Server Error UPDATE STOCK " + error });
  }
  });


export default productRoute