import fs from "fs"

const colorfile = JSON.parse(fs.readFileSync("./newColors.json"))
const collectionFile = JSON.parse(fs.readFileSync("./newCollections.json"))
const categoryFile = JSON.parse(fs.readFileSync("./newCategories.json"))
const productFile = JSON.parse(fs.readFileSync("./newProducts.json"))



// https://semesterprojekt-server.azurewebsites.net/

const color = async ()=>{
  colorfile.forEach(async color => {
    const res = await fetch(`https://semesterprojekt-server.azurewebsites.net/colors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(color),
    });
    return res.ok
});    
}

const collection = async ()=>{
  collectionFile.forEach(async color => {
    const res = await fetch(`https://semesterprojekt-server.azurewebsites.net/collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(color),
    });
    return res.ok
});    
}

const category = async ()=>{
  categoryFile.forEach(async color => {
    const res = await fetch(`https://semesterprojekt-server.azurewebsites.net/categories`, {
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
      productFile.forEach(async product => {
                const res = await fetch(`https://semesterprojekt-server.azurewebsites.net/products`, {
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
category()
collection()
product()




