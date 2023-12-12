import { Router } from "express";
import Color from "../models/Color.js";
import ProductColor from "../models/ProductColor.js";

const colorRoute = Router();

colorRoute.get("/", async (req, res) => {
try {
     const colors = await Color.findAll();

    res.json(colors);
} catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Internal Server Error in GET COLOR" });
}
});


colorRoute.post("/", async (req, res) => {
try {
    const newColor = req.body;
    const [color, built] = await Color.findOrBuild({
    where: {
        Code: newColor.Code,
    },
    });
    if (built) {
    color.Name = newColor.Name;
    await color.save();
    if (newColor.products) {
        newColor.products.forEach(async (product) => {
        await ProductColor.findOrCreate({
            where: {
            product_id: product,
            color_id: newColor.Code,
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

colorRoute.put("/:id", async (req, res) => {
const newColor = req.body;
try {
    const color = await Color.update(
    {
        Name: newColor.Name,
        Code: req.params.id,
    },
    {
        where: {
        Code: req.params.id,
        },
    }
    );

    res.json(color);
} catch (error) {
    console.error("Error updating color:", error);
    res.status(500).json({ error: "Internal Server Error UPDATE COLOR" });
}
});

colorRoute.delete("/:id", async (req, res) => {
try {
    const color = await Color.destroy({
    where: {
        Code: req.params.id,
    },
    });

    res.json(color);
} catch (error) {
    console.error("Error deleting color:", error);
    res.status(500).json({ error: "Internal Server Error DELETE COLOR" });
}
});

export default colorRoute;