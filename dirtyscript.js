import fs from "fs"

const colorfile = JSON.parse(fs.readFileSync("./newColors.json"))
const json3 = JSON.parse(fs.readFileSync("./newCollections.json"))
const json4 = JSON.parse(fs.readFileSync("./newCategories.json"))
const json1 = JSON.parse(fs.readFileSync("./newProducts.json"))



// https://semesterprojekt-server.azurewebsites.net/products

const color = async ()=>{
  colorfile.forEach(async color => {
    const res = await fetch(`http://localhost:3000/colors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(color),
    });
    return res.ok
});    
}

const product = async ()=> {
      json1.forEach(async product => {
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


color()
product()




