import express from "express";
import cors from "cors";
import { Sequelize, DataTypes } from "sequelize";
import "dotenv/config";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(cors());
const pEnv = process.env;

const PORT = pEnv.PORT | 3000;

app.get("/", (req, res) => {
  res.send("Node express running!");
});

// Create a Sequelize instance
const sequelize = new Sequelize(
  pEnv.MYSQL_DATABASE,
  pEnv.MYSQL_USER,
  pEnv.MYSQL_PASSWORD,
  {
    host: pEnv.MYSQL_HOST,
    dialect: "mysql",
    // dialectOptions: {
    //   ssl: {
    //     ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem"),
    //   },
    // },
  }
);

// Define models for orders, order_items, and products
const Product = sequelize.define("Product", {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Stock: {
    type: DataTypes.INTEGER,
  },
});

const Collection = sequelize.define(
  "Collection",
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    createdAt: false,
    timestamps: false,
    updatedAt: false,
  }
);

const Color = sequelize.define(
  "Color",
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    createdAt: false,
    timestamps: false,
    updatedAt: false,
  }
);

const Review = sequelize.define("Review", {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  Reviewer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Image = sequelize.define(
  "Image",
  {
    href: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    timestamps: false,
    updatedAt: false,
  }
);

const ProductColor = sequelize.define(
  "Product_Color",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Product",
        key: "ID",
      },
    },
    color_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Color",
        key: "ID",
      },
    },
  },
  {
    createdAt: false,
    timestamps: false,
    updatedAt: false,
  }
);

const ProductCollection = sequelize.define(
  "Product_Collection",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Product",
        key: "ID",
      },
    },
    collection_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Collection",
        key: "ID",
      },
    },
  },
  {
    createdAt: false,
    timestamps: false,
    updatedAt: false,
  }
);

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

Product.belongsToMany(Color, {
  as: "ProductColor",
  through: ProductColor,
  foreignKey: "product_id",
});
Color.belongsToMany(Product, {
  as: "ProductColor",
  through: ProductColor,
  foreignKey: "color_id",
});

Product.belongsToMany(Collection, {
  as: "ProductCollection",
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
    await sequelize.sync(); // Use { force: true } to recreate tables on every app start
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
}

//PRODUCT

app.get("/products", async (req, res) => {
  try {
    let products;
    if (req.query.pageSize >= 5) {
      products = await Product.findAll({
        include: [
          { model: Color, as: "ProductColor" },
          { model: Collection, as: "ProductCollection" },
          { model: Review },
          { model: Image },
        ],
        offset: Number(req.query.offSet),
        limit: Number(req.query.pageSize),
      });
    } else {
      products = await Product.findAll({
        include: [
          { model: Color, as: "ProductColor" },
          { model: Collection, as: "ProductCollection" },
          { model: Review },
          { model: Image },
        ],
      });
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
        Stock: newProduct.Stock,
      },
    });
    if (built) {
      product.ID = Math.floor(Math.random() * 10000);
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
      if (newProduct.colors) {
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
    res.status(500).json({ error: "Internal Server Error" });
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
      },
      {
        where: {
          ID: req.params.id,
        },
      }
    );

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/// COLOR ///
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
      color.ID = Math.floor(Math.random() * 10000);
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
    res.status(500).json({ error: "Internal Server Error" });
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
    res.status(500).json({ error: "Internal Server Error" });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// COLLECTION

app.post("/collections", async (req, res) => {
  try {
    const newCollection = req.body;
    const [collection, built] = await Collection.findOrBuild({
      where: {
        Name: newCollection.Name,
      },
    });
    if (built) {
      collection.ID = Math.floor(Math.random() * 10000);
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
    res.status(500).json({ error: "Internal Server Error" });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/collection/:id", async (req, res) => {
  try {
    const collection = await Collection.destroy({
      where: {
        ID: req.params.id,
      },
    });

    res.json(collection);
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
