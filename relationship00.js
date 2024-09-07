// Import the required modules (express and body-parser)
import express from 'express';
import bodyParser from 'body-parser';

// Create an Express app instance
const app = express();

// Use body-parser to parse incoming JSON requests
app.use(bodyParser.json());

// Define the port the server will listen on
const port = 3000;

// Define five users with their respective passwords for authentication
const accounts = ['james', 'larry', 'lucy', 'banana', 'alex'];
const credentials = {
  james: 'password123', // james's password
  larry: 'password456', // larry's password
  lucy: 'password789',  // lucy's password
  banana: 'password101', // banana's password
  alex: 'password202'   // alex's password
};

// Define a relationship structure that holds each user's relationship status with other users
const relationships = {
  james: { larry: 'stranger', lucy: 'stranger', banana: 'stranger', alex: 'stranger' },
  larry: { james: 'stranger', lucy: 'stranger', banana: 'stranger', alex: 'stranger' },
  lucy: { james: 'stranger', larry: 'stranger', banana: 'stranger', alex: 'stranger' },
  banana: { james: 'stranger', larry: 'stranger', lucy: 'stranger', alex: 'stranger' },
  alex: { james: 'stranger', larry: 'stranger', lucy: 'stranger', banana: 'stranger' }
};

// Middleware function to authenticate the user
function authenticate(req, res, next) {
  const { username, password } = req.body; // Extract username and password from the request body

  // Validate if the username exists and password matches
  if (!accounts.includes(username) || credentials[username] !== password) {
    return res.status(401).send({ error: 'Authentication failed. Invalid username or password.' });
  }

  // If authentication is successful, attach the username to the request and proceed to the next middleware
  req.user = username;
  next();
}


// Route to get all relationship statuses (GET request to /relationships)
app.get('/relationships', authenticate, (req, res) => {
  // Send the entire relationships object as a JSON response
  res.status(200).send(relationships);
});


// Route to get the relationship status for a specific user (GET request to /relationships/:name)
app.get('/relationships/:name', authenticate, (req, res) => {
  const { name } = req.params; // Extract the name parameter from the URL

  // Check if the user exists in the accounts list
  if (!accounts.includes(name)) {
    return res.status(404).send({ error: 'User not found.' }); // Send 404 error if the user doesn't exist
  }

  // Send the relationship status for the specified user
  res.status(200).send(relationships[name]);
});

// Route to modify the relationship status between two users (PATCH request to /setstatus)
app.patch('/setstatus', authenticate, (req, res) => {
  const { target, status } = req.body; // Extract target and new status from the request body
  const user = req.user; // Get the authenticated user from the request

  // Ensure that the target exists in the accounts list
  if (!accounts.includes(target)) {
    return res.status(400).send({ error: 'Invalid target.' }); // Send 400 error if target doesn't exist
  }

  // Update the relationship status between the authenticated user and the target
  relationships[user][target] = status;

  // Send the updated relationships object as a JSON response
  res.status(200).send(relationships);
});

// Route to reset all relationships to "stranger" for the authenticated user (POST request to /reset)
app.post('/reset', authenticate, (req, res) => {
  const user = req.user; // Get the authenticated user from the request

  // Loop through all accounts and reset the relationship status to "stranger" for the authenticated user
  accounts.forEach(target => {
    if (user !== target) { // Avoid resetting the relationship with themselves
      relationships[user][target] = 'stranger';
    }
  });

  // Send a success message and the updated relationships object
  res.status(200).send({ message: 'All relationships reset to stranger.', relationships });
});

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Server started on port: ${port}`); // Log when the server is running
});
