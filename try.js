import express from "express";
const app = express();

const port= 3000;

// Route to handle GET requests to the root path "/"
app.get('/', (req, res) => {
    // Send a JSON response with a message
    res.json({ message: 'All hail, shashKing!' });
});

//app.get("/", (req,res) => {
//res.send("All hail, Lord shashKing");
//});

app.listen(port, ()=> {
    console.log("All      hail, shashKing!!");
});