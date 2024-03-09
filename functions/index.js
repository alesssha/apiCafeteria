/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions=require('firebase-functions');
const admin =require('firebase-admin')
const express=require('express')
const cors = require('cors');

admin.initializeApp({
    credential: admin.credential.cert('./permissions.json'),
    databaseURL: "https://cafeteria-183ec-default-rtdb.firebaseio.com"
})
const db = admin.firestore()
const app= express()

app.use(cors());

app.get('/holiwis',(req, res )=>{
   return  res.status(200).json({message: 'holiwis'})


});

app.post('/api/products', async (req, res) =>{
    try {
        await db
        .collection('products')
        .doc('/'+ req.body.id + '/')
        .create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        });
        return res.status(204).json();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.get("/api/products/:product_id", (req, res) =>{
    (async() =>{
        try {
            const doc =db.collection("products").doc(req.params.product_id);
            const item = await doc.get()
            const response = item.data()
            return res.status(200).json(response)
        } catch (error) {
        return res.status(500).send(error);  
        }
    })();
});

app.get("/api/products", async (req, res) =>{
    try {
        const query = db.collection("products");
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;
        const response = docs.map((doc) =>({
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
            description: doc.data().description,
        }));
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error); 
        
    }
});

app.get("/api/products/search", async (req, res) => {
    try {
        const searchTerm = req.query.q.toLowerCase(); // Obtener el término de búsqueda de la consulta de la URL y convertirlo a minúsculas
        const querySnapshot = await db.collection("products").where('name', '==', searchTerm).get();
        const filteredProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Respuesta de la búsqueda:", filteredProducts); // Agrega esta línea para imprimir la respuesta en la consola
        return res.status(200).json(filteredProducts);
    } catch (error) {
        console.error("Error al buscar productos:", error); // Agrega esta línea para imprimir cualquier error en la consola
        return res.status(500).send(error);
    }
});



app.delete("/api/products/:product_id", async (req, res) =>{
    try {
        const document =db.collection("products").doc(req.params.product_id);
        await document.delete();
        return res.status(200).json();
    } catch (error) {
        return res.status(500).send(error); 
    }
});

app.put("/api/products/:product_id", async (req, res) =>{
    try {
        const document =db.collection("products").doc(req.params.product_id);
        await document.update({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        });
        return res.status(200).json();
    } catch (error) {
        return res.status(500).send(error);   
    }
});




exports.app = functions.https.onRequest(app);



// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });