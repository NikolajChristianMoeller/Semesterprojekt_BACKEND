import express from "express";
import cors from "cors";
import "dotenv/config";
import Collection from "./models/Collection.js";
import sequelize from "./models/Sequalize.js";
import Color from "./models/Color.js";
import Image from "./models/Image.js";
import Product from "./models/Product.js";
import ProductCollection from "./models/ProductCollection.js";
import ProductColor from "./models/ProductColor.js";
import Review from "./models/Review.js";
import Category from "./models/Category.js";
import ProductCategory from "./models/ProductCategory.js";


const app = express();
app.use(express.json());
app.use(cors());
const pEnv = process.env;

const PORT = pEnv.PORT | 3000;

// Define associations between the models
ProductColor.associate = () => {
  ProductColor.belongsTo(Product, {
    foreignKey: "ID",
    targetKey: "product_id",
    as: "Product",
  });
  ProductColor.belongsTo(Color, {
    foreignKey: "ID",
    targetKey: "color_id",
    as: "Color",
  });
};

ProductCollection.associate = () => {
  ProductCollection.belongsTo(Product, {
    foreignKey: "ID",
    targetKey: "product_id",
    as: "Product",
  });
  ProductCollection.belongsTo(Collection, {
    foreignKey: "ID",
    targetKey: "collection_id",
    as: "Collection",
  });
};

ProductCategory.associate = () => {
  ProductCategory.belongsTo(Product, {
    foreignKey: "ID",
    targetKey: "product_id",
    as: "Product",
  });
  ProductCategory.belongsTo(Category, {
    foreignKey: "ID",
    targetKey: "category_id",
    as: "Category",
  });
};

Product.belongsToMany(Category, {
  as: "Categories",
  through: ProductCategory,
  foreignKey: "product_id",
});
Category.belongsToMany(Product, {
  as: "ProductCategory",
  through: ProductCategory,
  foreignKey: "category_id",
});

Product.belongsToMany(Color, {
  as: "Colors",
  through: ProductColor,
  foreignKey: "product_id",
});
Color.belongsToMany(Product, {
  as: "ProductColor",
  through: ProductColor,
  foreignKey: "color_id",
});

Product.belongsToMany(Collection, {
  as: "Collections",
  through: ProductCollection,
  foreignKey: "product_id",
});
Collection.belongsToMany(Product, {
  as: "ProductCollection",
  through: ProductCollection,
  foreignKey: "collection_id",
});

Product.hasMany(Review);
Review.belongsTo(Product);

Product.hasMany(Image);
Image.belongsTo(Product);

// Sync the models with the database
async function syncDatabase() {
  try {
    await sequelize.sync({force: true}); // Use { force: true } to recreate tables on every app start
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
}

// ROUTES //

//PRODUCT

app.get("/products", async (req, res) => {
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

//NEEDS A BETTER 'WHERE'! V
app.post("/products", async (req, res) => {
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

app.put("/products/:id", async (req, res) => {
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

app.delete("/products/:id", async (req, res) => {
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

/// COLOR ///
app.get("/colors", async (req, res) => {
  try {
    let colors;
    if (req.query.pageSize >= 5) {
      colors = await Color.findAll();
    } else {
      colors = await Color.findAll();
    }

    res.json(colors);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Internal Server Error in GET COLOR" });
  }
});


app.post("/colors", async (req, res) => {
  try {
    const newColor = req.body;
    const [color, built] = await Color.findOrBuild({
      where: {
        Name: newColor.Name,
        Code: newColor.Code,
      },
    });
    if (built) {
      color.ID = Math.floor(Math.random() * 100000000);
      await color.save();
      if (newColor.products) {
        newColor.products.forEach(async (product) => {
          await ProductColor.findOrCreate({
            where: {
              product_id: product,
              color_id: newColor.ID,
            },
          });
        });
      }

      res.json(color);
    } else {
      res.status(500).json({ error: "An Identical color already exists!" });
    }
  } catch (error) {
    console.error("Error creating color:", error);
    res.status(500).json({ error: "Internal Server Error CREATE COLOR" });
  }
});

app.put("/colors/:id", async (req, res) => {
  const newColor = req.body;
  try {
    const color = await Color.update(
      {
        Name: newColor.Name,
        Code: newColor.Code,
      },
      {
        where: {
          ID: req.params.id,
        },
      }
    );

    res.json(color);
  } catch (error) {
    console.error("Error updating color:", error);
    res.status(500).json({ error: "Internal Server Error UPDATE COLOR" });
  }
});

app.delete("/colors/:id", async (req, res) => {
  try {
    const color = await Color.destroy({
      where: {
        ID: req.params.id,
      },
    });

    res.json(color);
  } catch (error) {
    console.error("Error deleting color:", error);
    res.status(500).json({ error: "Internal Server Error DELETE COLOR" });
  }
});

// COLLECTION
app.get("/collections", async (req, res) => {
  try {
    let collections;
    if (req.query.pageSize >= 5) {
      collections = await Collection.findAll();
    } else {
      collections = await Collection.findAll();
    }

    res.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Internal Server Error in GET COLLECTION" });
  }
});

app.post("/collections", async (req, res) => {
  try {
    const newCollection = req.body;
    const [collection, built] = await Collection.findOrBuild({
      where: {
        Name: newCollection.Name,
      },
    });
    if (built) {
      collection.ID = Math.floor(Math.random() * 100000000);
      await collection.save();
      if (newCollection.products) {
        newCollection.products.forEach(async (product) => {
          await ProductCollection.findOrCreate({
            where: {
              product_id: product,
              collection_id: newCollection.ID,
            },
          });
        });
      }

      res.json(collection);
    } else {
      res
        .status(500)
        .json({ error: "An Identical collection already exists!" });
    }
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ error: "Internal Server Error CREATE COLLECTION" });
  }
});

app.put("/collections/:id", async (req, res) => {
  const newCollection = req.body;
  try {
    const collection = await Collection.update(
      {
        Name: newCollection.Name,
        Code: newCollection.Code,
      },
      {
        where: {
          ID: req.params.id,
        },
      }
    );

    res.json(collection);
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ error: "Internal Server Error UPDATE COLLECTION" });
  }
});

app.delete("/collections/:id", async (req, res) => {
  try {
    const collection = await Collection.destroy({
      where: {
        ID: req.params.id,
      },
    });

    res.json(collection);
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Internal Server Error DELETE COLLECTION" });
  }
});

// Category
app.get("/categories", async (req, res) => {
  try {
    let category;
    if (req.query.pageSize >= 5) {
      category = await Category.findAll();
    } else {
      category = await Category.findAll();
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error in GET CATEGORY" });
  }
});


app.post("/categories", async (req, res) => {
  try {
    const newCategory = req.body;
    const [category, built] = await Category.findOrBuild({
      where: {
        Name: newCategory.Name,
      },
    });
    if (built) {
      category.ID = Math.floor(Math.random() * 100000000);
      await category.save();
      if (newCategory.products) {
        newCategory.products.forEach(async (product) => {
          await ProductCategory.findOrCreate({
            where: {
              product_id: product,
              category_id: newCategory.ID,
            },
          });
        });
      }

      res.json(category);
    } else {
      res.status(500).json({ error: "An Identical category already exists!" });
    }
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal Server Error CREATE CATEGORY" });
  }
});

app.put("/categories/:id", async (req, res) => {
  const newCategory = req.body;
  try {
    const category = await Category.update(
      {
        Name: newCategory.Name,
      },
      {
        where: {
          ID: req.params.id,
        },
      }
    );

    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal Server Error UPDATE CATEGORY" });
  }
});

app.delete("/categories/:id", async (req, res) => {
  try {
    const category = await Category.destroy({
      where: {
        ID: req.params.id,
      },
    });

    res.json(category);
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal Server Error DELETE CATEGORY" });
  }
});


// Middleware for syncing the database and running example functions
app.use(async (req, res, next) => {
  await syncDatabase();
  next();
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
