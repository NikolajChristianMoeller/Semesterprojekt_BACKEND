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


const productRoute = Router()


productRoute.get("/", async (req, res) => {
    try {
      let products;
      if (req.query.pageSize >= 5) {
        products = await Product.findAll({
          include: [
            { model: Color, as: "Colors" },
            { model: Collection, as: "Collections" },
            { model: Category, as: "Categories" },
            { model: Review },
            { model: Image },
          ],
          offset: Number(req.query.offSet),
          limit: Number(req.query.pageSize),
        });
      } else {
        products = await Product.findAll({
          include: [
            { model: Color, as: "Colors" },
            { model: Collection, as: "Collections" },
            { model: Category, as: "Categories" },
            { model: Review },
            { model: Image },
          ],
        });
      }
  
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Error getting products" });
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
    const [product, built] = await Product.findOrBuild({
    where: {
        Name: newProduct.Name,
        Price: newProduct.Price,
        Description: newProduct.Description,
        Stock: newProduct.Stock
    },
    });
    if (built) {
    product.ID = Math.floor(Math.random() * 100000000);
    product.Stock = newProduct.Stock;
    await product.save();
    if (newProduct.colors) {
        newProduct.colors.forEach(async (color) => {
        await ProductColor.findOrCreate({
            where: {
            product_id: product.ID,
            color_id: color,
            },
        });
        });
    }
    if (newProduct.collections) {
        newProduct.collections.forEach(async (collection) => {
        await ProductCollection.findOrCreate({
            where: {
            product_id: product.ID,
            collection_id: collection,
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
    if (newProduct.colors) {
    await ProductColor.destroy({
        where: {
        product_id: req.params.id,
        },
    });
    newProduct.colors.forEach(async (color) => {
        await ProductColor.findOrCreate({
        where: {
            product_id: product.ID,
            color_id: color,
        },
        });
    });
    }
    if (newProduct.collections) {
    await ProductCollection.destroy({
        where: {
        product_id: req.params.id,
        },
    });
    newProduct.collections.forEach(async (collection) => {
        await ProductCollection.findOrCreate({
        where: {
            product_id: product.ID,
            collection_id: collection,
        },
        });
    });
    }
    if (newProduct.categories) {
    await ProductCategory.destroy({
        where: {
        product_id: req.params.id,
        },
    });
    newProduct.collections.forEach(async (collection) => {
        await ProductCollection.findOrCreate({
        where: {
            product_id: product.ID,
            collection_id: collection,
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