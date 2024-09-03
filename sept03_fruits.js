// Unity
import express from "express";
const app = express();

const port= 3000;

const fruitNames = ['apple', 'banana', 'orange', 'mango', 'grape'];

app.use((req, res, next) => {  
    res.send(fruitNames); // Send the fruit names as an array    
    next();
});

app.get("/", (req,res) => {
    //res.send("All hail, Lord shashKing");
    res.send("what happened, King??");
    //console.log(req);

});
    


app.listen(port, ()=> {
    console.log("All hail, shashKing!!");
});