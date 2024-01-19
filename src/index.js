const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/api", (req, res) => {
    res.send("Hello World!, Ini aku express JS");
});


app.get("/products", async (req, res) => {
    const products = await prisma.product.findMany();

    res.send(products);
});

app.post("/products", async (req, res) => {
    const newProductData = req.body;

    const product = await prisma.product.create({
        data: {
            name: newProductData.name,
            description: newProductData.description,
            price: newProductData.price,
            image: newProductData.image
        }
    });

    res.status(201).send({
        data: product,
        message: "Product successfully created"
    });
});

app.delete("/products/:id", async (req, res) => {
    const productId = req.params.id

    await prisma.product.delete({
        where: {
            id: parseInt(productId)
        }
    });

    res.send("Product successfully deleted");
});

app.put("/products/:id", async (req, res) => {
    const productId = req.params.id;
    const productData = req.body;

    if (!(productData.image && productData.description && productData.name && productData.price)) {
        return res.status(400).send("Some fields are missing");
    }

    const product = await prisma.product.update({
        where: {
            id: parseInt(productId)
        },
        data: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image: productData.image
        }
    });

    res.send({
        data: product,
        message: "Product Succesfully edited"
    })
});

app.patch("/products/:id", async (req, res) => {
    const productId = req.params.id;
    const productData = req.body;

    const product = await prisma.product.update({
        where: {
            id: parseInt(productId)
        },
        data: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image: productData.image
        }
    });

    res.send({
        data: product,
        message: "Product Succesfully edited"
    })
});

app.listen(PORT, () => {
    console.log("Express running in port: " + PORT);
});