import sequelize from "./Sequalize.js";
import { DataTypes } from "sequelize";

//define structure of table

const ProductCategory = sequelize.define(
    "Product_Category",
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Product",
          key: "ID",
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Category",
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

export default ProductCategory