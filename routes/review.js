import Review from "../models/Review.js";
import { Router } from "express";

const reviewRoute = Router();

reviewRoute.post("/", async (req, res)=>{
    try {
        const review = req.body;
        await Review.findOrCreate({
        where: {
          ID: Math.floor(Math.random() * 100000000),
          Reviewer: review.Reviewer,
          Rating: review.Rating,
          Text: review.Text,
          ProductID: review.ProductID
        },
        });

    res.send("Review Created")
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ error: "Internal Server Error CREATE PRODUCT" + error });
        }

});

export default reviewRoute;