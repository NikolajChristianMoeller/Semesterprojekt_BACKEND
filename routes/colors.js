import { Router } from "express";
import Color from "../models/Color.js";
import ProductColor from "../models/ProductColor.js";

const colorRoute = Router();

colorRoute.get("/colors", async (req, res) => {
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


colorRoute.post("/colors", async (req, res) => {
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

colorRoute.put("/colors/:id", async (req, res) => {
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

colorRoute.delete("/colors/:id", async (req, res) => {
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

export default colorRoute;