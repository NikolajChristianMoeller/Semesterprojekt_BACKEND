import express from "express";
import cors from "cors";
import "dotenv/config";
import Collection from "./models/Collection.js";
import sequelize from "./models/Sequalize.js";
import Color from "./models/Color.js";
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
import reviewRoute from "./routes/review.js";
import { createTransport } from "nodemailer";



const app = express();
app.use(express.json());
app.use(cors());
const pEnv = process.env;

const PORT = pEnv.PORT | 8080;

// Create a Sequelize instance
const sequelize = new Sequelize(
  pEnv.MYSQL_DATABASE,
  pEnv.MYSQL_USER,
  pEnv.MYSQL_PASSWORD,
  {
    host: pEnv.MYSQL_HOST,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem"),
      },
    },
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
    foreignKey: "Code",
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

// Sync the models with the database
async function syncDatabase(bool) {
  try {
    await sequelize.sync({force: bool}); // If { force: true } this will whipe database and recreate tables (should only be used if changes are made to the schemas)
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

app.use("/reviews", reviewRoute)

app.get("/keys", async (req, res) =>{
  try {
    let product;
      product = await Product.findAll({
        attributes: ["ID"]     
      });  
    res.json(product);
  } catch (error) {
    console.error("Error fetching product IDs:", error);
    res.status(500).json({ error: "Error getting product IDs" });
  }
})

app.get("/", async (req, res)=>{
  await syncDatabase(false);
  res.send("Database Sync successful")
})


app.post("/mail", async (req, res)=>{
  try {
    const transport = createTransport({
      service: "gmail",
      auth: {
          user: pEnv.GMAIL_USER,
          pass: pEnv.GMAIL_PASS
      }  
  })
  
  const content = {
      from: "noreplymikrohome@gmail.com",
      to: req.body.mailTo,
      subject: `Ordrebekræftelse ${req.body.orderNum}`,
      text: req.body.message
  }
  
  transport.sendMail(content, (err, res)=>{
      if(err){
        throw new Error("error sending mail"+ err)
      }
  })
  res.send("Mail sent");
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Error while sending mail!"})
  }

})


//top secret route to force reset the database
//should be removed before final deploy
app.delete("/NsgYDdDoWqga0CvO55Km", async (req, res)=>{
  await syncDatabase(true);
  res.send("Database Reset complete")
})


// Middleware for syncing the database and running example functions
// runs on "/" atm should be changed so it doesn't sync everytime an undefined route is called or whenever "/" is accessed

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
