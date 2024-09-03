import express from "express";
const app = express();

const port= 3000;

const fruitNames = ['apple', 'banana', 'orange', 'mango', 'grape'];

app.use((req, res, next) => {  
    res.send(fruitNames); // Send the fruit names as an array
    ////res.send({fruitNames}); // Send the fruit names as an object
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


//object code below
// Define an array of fruit objects with properties
const fruits = [
    { name: "apple", color: "red", taste: "sweet" },
    { name: "banana", color: "yellow", taste: "sweet" },
    { name: "orange", color: "orange", taste: "tart" },
    { name: "mango", color: "yellow", taste: "sweet" },
    { name: "grape", color: "purple", taste: "sweet" },
];

app.use((req, res, next) => {  
    res.send(fruits); // Send the fruit data as an object with a "fruitData" property
    next();
});
