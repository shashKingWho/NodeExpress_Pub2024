//console.log("All hail shashKing!!");

// Import Express Module
import express from 'express';
import bodyParser from 'body-parser';

// Create an Express app instance
const app = express();


app.use(bodyParser.json());

// specify the port for the server
const port = 3000;

// creating a friends object with name key and their status as values
const friends = {
    'james': 'friend',
    'Larry': 'friend',
    'Lucy': 'friend',
    'banana': 'enemy'
}


// Route to get a list of all friends (GET request to /friends)
app.get('/friends', (req, res) => {
    // Send the entire friends object as a JSON response with a status code of 200 (OK)
    res.status(200).send(friends);
  });
  
  // Route to get details of a specific friend by name (GET request to /friends/:name)
  app.get('/friends/:name', (req, res) => {
    const { name } = req.params; // Extract the name parameter from the request URL
    // Check if the name exists in the friends object and if a name is provided
    if (!name || !(name in friends)) {
      // If the name is missing or not found, send a 404 Not Found status code with no content
      return res.sendStatus(404);
    }
  
    // Send the friend's information as a JSON response with a status code of 200 (OK)
    res.status(200).send({ [name]: friends[name] }); // Use bracket notation for dynamic property access
  });
  
  // Route to add a new friend (POST request to /addfriend)
  app.post('/addfriend', (req, res) => {
    const { name, status } = req.body; // Extract name and status from the request body
  
    // Add the new friend to the friends object with the provided name and status
    friends[name] = status;
  
    // Send the updated friends object as a JSON response with a status code of 200 (OK)
    res.status(200).send(friends);
  });
  
  // Route to change the status of an existing friend (PATCH request to /changestatus)
  app.patch('/changestatus', (req, res) => {
    const {name, newStatus } = req.body; // Extract name and new status from the request body
  
    // Check if the friend exists
    if (!(name in friends)) {
      // If the name is not found, send a 404 Not Found status code with no content
      return res.sendStatus(404);
    }
  
    // Update the friend's status in the friends object
    friends[name] = newStatus;
  
    // Send the updated friends object as a JSON response with a status code of 200 (OK)
    res.status(200).send(friends);
  });
  
  // Route to delete a friend (DELETE request to /friends)
  app.delete('/friends', (req, res) => {
    const { name } = req.body; // Extract the name to delete from the request body
  
    // Check if the friend exists
    if (!(name in friends)) {
      // If the name is not found, send a 404 Not Found status code with no content
      return res.sendStatus(404);
    }
  
    // Delete the friend from the friends object
    delete friends[name];
  
    // Send the updated friends object as a JSON response with a status code of 200 (OK)
    res.status(200).send(friends);
  });

  

  //start the server and listen for incoming request on the specified port
  app.listen(port, ()=> {
    console.log(`Server has started on port: ${port}`);

  });


