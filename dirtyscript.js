import fs from "fs"

const json = JSON.parse(fs.readFileSync("./newProducts.json"))

// https://semesterprojekt-server.azurewebsites.net/products

const script = async ()=> {
    json.forEach(async product => {
              const res = await fetch(`http://localhost:3000/products`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
              });
              return res.ok
    });    

}

script();




// OLD TEST DATA : 
// async function createSampleData() {
//     try {
  
//         const product1 = await Product.create({
//           ID: Math.floor(Math.random() * 100000000),
//           Name: "Shrek Lamp",
//           Price: 20000,
//           Description: "Greenest lamp you will ever own. A must buy for anyone really.",
//           Stock: 5
//         })
  
//         const product2 = await Product.create({
//           ID: Math.floor(Math.random() * 100000000),
//           Name: "Dreamcatcher 2",
//           Price: 300,
//           Description: "Catches dreams (your milage may vary)",
//           Stock: 300
//         })
  
//         const product3 = await Product.create({
//           ID: Math.floor(Math.random() * 100000000),
//           Name: "Dreamcatcher 3",
//           Price: 350,
//           Description: "Catches dreams (your milage may vary)",
//           Stock: 200
//         })
  
//         const color1 = await Color.create({
//           ID: Math.floor(Math.random() * 100000000),
//           Name: "Shrek Green",
//           Code: "#D1E000"
//         })
  
//         const color2 = await Color.create({
//           ID: Math.floor(Math.random() * 100000000),
//           Name: "White",
//           Code: "#ffffff"
//         })
//         const color3 = await Color.create({
//           ID: Math.floor(Math.random() * 100000000),
//           Name: "Black",
//           Code: "#000000"
//         })
  
//         const collection1 = await Collection.create({
//           ID: Math.floor(Math.random() * 100000000),
//           Name: "Collec-Shrek-tion"
//         })  
        
//         const collection2 = await Collection.create({
//           ID: Math.floor(Math.random() * 100000000),
//           Name: "Collecion 2"
//         }) 
  
//         await Review.create({
//           ID: Math.floor(Math.random() * 100000000),
//           Reviewer: "Mike",
//           Text: "Best lamp ever. Saved my marriage. Twice!",
//           Rating: 10,
//           ProductID: product1.ID
//         })
  
//         await Image.create({
//           href: "image.jpeg",
//           ProductID: product1.ID,
//           Description: "Do I look like I know what a JPEG is?! I just want a picture of a god dang hotdog!"
//         })
  
//         await ProductCollection.create({
//           product_id: product1.ID,
//           collection_id: collection1.ID
//         })
  
//         await ProductCollection.create({
//           product_id: product1.ID,
//           collection_id: collection2.ID
//         })
  
//         await ProductCollection.create({
//           product_id: product2.ID,
//           collection_id: collection1.ID
//         })
  
//         await ProductCollection.create({
//           product_id: product3.ID,
//           collection_id: collection1.ID
//         })
  
//         await ProductColor.create({
//           product_id: product1.ID,
//           color_id: color1.ID
//         })
  
//         await ProductColor.create({
//           product_id: product1.ID,
//           color_id: color2.ID
//         })
  
//         await ProductColor.create({
//           product_id: product2.ID,
//           color_id: color3.ID
//         })
  
//         await ProductColor.create({
//           product_id: product3.ID,
//           color_id: color3.ID
//         })
  
  
//       console.log("Sample data created");
//     } catch (error) {
//       console.error("Error creating sample data:", error);
//     }
//   }
  