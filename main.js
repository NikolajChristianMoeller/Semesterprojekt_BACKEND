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
import productRoute from "./routes/products.js";
import colorRoute from "./routes/colors.js";
import collectionRoute from "./routes/collections.js";
import categoryRoute from "./routes/categories.js";


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
    await sequelize.sync(); // Use { force: true } to whipe database and recreate tables on every app start (should only be used if changes are made to the schemas)
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
}

// ROUTES //

app.use("/products", productRoute);

app.use("/colors", colorRoute);

app.use("/collections", collectionRoute);

app.use("/categories", categoryRoute);


// Middleware for syncing the database and running example functions
// runs on "/" atm should be changed so it doesn't sync everytime an undefined route is called or whenever "/" is accessed
app.use(async (req, res, next) => {
  await syncDatabase();
  next();
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
