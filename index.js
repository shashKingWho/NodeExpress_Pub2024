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
const accounts = ['james', 'harry', 'lucy', 'dobby', 'lupin'];
const credentials = {
  james: 'pwda', // james's password
  harry: 'pwdb', // harry's password
  lucy: 'pwdc',  // lucy's password
  dobby: 'password101', // dobby's password password101
  lupin: 'password202'   // lupin's password
};

// Define a relationship structure that holds each user's relationship status with other users
const relationships = {
  james: { harry: 'friend', lucy: 'friend', dobby: 'friend', lupin: 'stranger' },
  harry: { james: 'friend', lucy: 'stranger', dobby: 'friend', lupin: 'stranger' },
  lucy: { james: 'stranger', harry: 'friend', dobby: 'friend', lupin: 'friend' },
  dobby: { james: 'friend', harry: 'stranger', lucy: 'stranger', lupin: 'stranger' },
  lupin: { james: 'stranger', harry: 'friend', lucy: 'friend', dobby: 'friend' },
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
  res.status(200).send(relationships);
});

// Route to get the relationship status for a specific user (GET request to /relationships/:name)
app.get('/relationships/:name', authenticate, (req, res) => {
  const { name } = req.params;

  if (!accounts.includes(name)) {
    return res.status(404).send({ error: 'User not found.' });
  }

  res.status(200).send(relationships[name]);
});

// Route to modify the relationship status between two users (PATCH request to /setstatus)
app.patch('/setstatus', authenticate, (req, res) => {
  const { target, status } = req.body;
  const user = req.user;

  if (!accounts.includes(target)) {
    return res.status(400).send({ error: 'Invalid target.' });
  }

  relationships[user][target] = status;
  res.status(200).send(relationships);
});

// Route to reset all relationships to "stranger" for the authenticated user (POST request to /reset)
app.post('/reset', authenticate, (req, res) => {
  const user = req.user;

  accounts.forEach(target => {
    if (user !== target) {
      relationships[user][target] = 'stranger';
    }
  });

  res.status(200).send({ message: 'All relationships reset to stranger.', relationships });
});


// New Routes

// 1. Route to show accounts which the authenticated user is friends with (GET /friends)
app.get('/friends', authenticate, (req, res) => {
  const user = req.user;
  const friends = Object.keys(relationships[user]).filter(
    target => relationships[user][target] === 'friend'
  );
  res.status(200).send({ friends });
});

// 2. Route to show accounts where other users are friends with the authenticated user (GET /friendsOfMe)
app.get('/friendsOfMe', authenticate, (req, res) => {
  const user = req.user;
  const friendsOfMe = accounts.filter(
    target => relationships[target][user] === 'friend'
  );
  res.status(200).send({ friendsOfMe });
});

// 3. Route to show mutual friendships (GET /mutualFriends)
app.get('/mutualFriends', authenticate, (req, res) => {
  const user = req.user;
  const mutualFriends = accounts.filter(
    target => relationships[user][target] === 'friend' && relationships[target][user] === 'friend'
  );
  res.status(200).send({ mutualFriends });
});

// Route to get users who are friends with the authenticated user, but the authenticated user isn't friends with them
app.get('/pendingFriends', authenticate, (req, res) => {
  const user = req.user; // Get the authenticated user from the request

  // Find users who consider the authenticated user a friend, but the authenticated user isn't friends with them
  const pendingFriends = accounts.filter(target => {
    return relationships[target][user] === 'friend' && relationships[user][target] !== 'friend';
  });

  // Send the pending friends list
  res.status(200).send({ pendingFriends });
});

// Route to get users who are neither friends with the authenticated user nor have considered them a friend
app.get('/nonFriends', authenticate, (req, res) => {
  const user = req.user; // Get the authenticated user from the request

  // Find users who are neither friends with the authenticated user nor have considered them a friend
  const nonFriends = accounts.filter(target => {
    return relationships[user][target] !== 'friend' && relationships[target][user] !== 'friend';
  });

  // Send the non-friends list
  res.status(200).send({ nonFriends });
});


// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(relationships.james.harry);
  const jamesToharry = relationships.james.harry;
console.log(jamesToharry); // Output: 'friend'


console.log(Object.keys(relationships.james).length); // Output: 4



console.log(Object.keys(relationships).length); // Output: 5

//////
const relationHasJamesKey = 'james' in relationships;
console.log(relationHasJamesKey); // Output: true

const hasJamesKeyRelation = relationships.hasOwnProperty('james');
console.log(hasJamesKeyRelation); // Output: true

const hasFriend = Object.values(relationships.james).includes('friend');
console.log(hasFriend); // Output: true


  console.log(`Server started on port: ${port}`);
 
});
