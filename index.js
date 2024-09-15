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
  lucy: 'pwdc',  // lucy's password password789
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


// Route to modify the relationship status between two users (POST request to /setstatus)
// Using POST instead of PATCH because Unity handled POST better than "app.patch('/setstatus', authenticate, (req, res) => {"
app.post('/setstatus', authenticate, (req, res) => {
  const { target, status } = req.body; // Extract target and new status from the request body
  const user = req.user; // Get the authenticated user from the request

  // Ensure that the target exists in the accounts list
  if (!accounts.includes(target)) {
    return res.status(400).send({ error: 'Invalid target.' }); // Send 400 error if target doesn't exist
  }

  // Update the relationship status between the authenticated user and the target
  relationships[user][target] = status;

  // Check for mutual friendship
  if (relationships[user][target] === 'friend' && relationships[target][user] === 'friend') {
    return res.status(200).send({ message: "They are friends!", relationships });
  }

  // Send the updated relationships object if not mutual
  res.status(200).send({ relationships });
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



// Define a route to serve the HTML page
app.get('/policy', (req, res) => {
  res.send(`<!DOCTYPE html>
    <html>
    <head>
    <title>My Game Privacy Policy for Play Store</title>
    </head>
    <body>
    <h1>Privacy Policy for my games</h1>
    
    <p><strong>Effective Date: September 1, 2024</strong></p>
    
    <h2>1. Introduction</h2>
    
    <p>This Privacy Policy outlines how [Your Game Name] collects, uses, discloses, and protects your personal information when you use our mobile game application available on the Google Play Store.</p>
    
    <h2>2. Information We Collect</h2>
    
    <p>We may collect the following types of information:</p>
    <ul>
    <li><strong>Personal Information:</strong>   
     Your name, email address, and device information.</li>
    <li><strong>Usage Data:</strong> Information about your gameplay behavior, device information, and in-app purchases.</li>
    <li><strong>Third-Party Data:</strong> Data from third-party platforms or services integrated into our game.</li>
    </ul>
    
    <h2>3. How We Use Your Information</h2>
    
    <p>We use your information to:</p>
    <ul>
    <li>Provide the game and its features.</li>
    <li>Process in-app purchases.</li>
    <li>Provide customer support.</li>
    <li>Improve the game's features and content.</li>
    <li>Personalize your gaming experience.</li>
    <li>Comply with legal obligations.</li>
    </ul>
    
    <h2>4. Sharing Your Information</h2>
    
    <p>We may share your information with:</p>
    <ul>
    <li>Third-party service providers who help us operate the game.</li>
    <li>Legal authorities as required by law.</li>
    </ul>
    
    <h2>5. Data Security</h2>
    
    <p>We implement reasonable security measures to protect your personal information.</p>
    
    <h2>6. Children's Privacy</h2>
    
    <p>Our game is not intended for children under the age of 18. We do not knowingly collect personal information from children.</p>   
    
    
    <h2>7. Your Choices</h2>
    
    <p>You have the following choices regarding your information:</p>
    <ul>
    <li>Manage your account settings and privacy preferences within the game.</li>
    <li>Opt-out of marketing communications.</li>
    <li>Request the deletion of your account and its associated data.</li>
    </ul>
    
    <h2>8. Changes to This Privacy Policy</h2>
    
    <p>We may update this Privacy Policy from time to time.</p>
    
    <h2>9. Contact Us</h2>
    
    <p>If you have any questions about this Privacy Policy or our practices, please contact us at:</p>
    
    <p>My email: shashaankinbox@gmail.com</p>    
    <p>By using our game, you consent to the collection and use of your information as described in this Privacy Policy.</p>  
    </body>
    </html>`);
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
