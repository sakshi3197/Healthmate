

require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const port = 5001;
const mongoUri = 'mongodb+srv://vikkolla:51owp5epaYDgv04K@healthmate.uikhmuk.mongodb.net/healthmate?retryWrites=true&w=majority';
process.env.MONGO_URI = mongoUri;
const mongoClient = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });
const dbName = process.env.MONGO_DB_NAME;
const userCollectionName = 'users';

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const session = require('express-session');



app.use(
  session({
    secret: 'your-session-secret', // Replace this with a secure, unique secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration to 1 day
    },
  })
);

// Initialize passport and use the Google OAuth strategy
app.use(passport.initialize());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (error) {
    done(error, null);
  } finally {
    await mongoClient.close();
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        await mongoClient.connect();
        const userCollection = mongoClient.db(dbName).collection(userCollectionName);

        const existingUser = await userCollection.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          type: "client"
        };

        const result = await userCollection.insertOne(newUser);
        return done(null, newUser);
      } catch (error) {
        done(error, null);
      } finally {
        await mongoClient.close();
      }
    }
  )
);




// Google OAuth routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/login' }),
  (req, res) => {
    
    // alert("Authentication successful.Redirecting! Please wait!")
    // Successful authentication, redirect home.
    // res.send("Authentication Successful");
    res.redirect('http://localhost:3000');
    
  }
);

function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log("token", token);
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
}


app.get('/api/posts', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    await mongoClient.connect();
    const workoutsCollection = mongoClient.db(dbName).collection('workouts');
    const query = searchQuery
    ? {
        $or: [
          { type: { $regex: searchQuery, $options: 'i' } },
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { name: { $regex: searchQuery, $options: 'i' } },
        ],
      }
    : {};
    const posts = await workoutsCollection.find(query).toArray();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching posts.');
  } finally {
    await mongoClient.close();
  }
});


app.post('/api/newpost', verifyToken, async (req, res) => {
  
  const { title, description, type, email, name } = req.body;

  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const user = await userCollection.findOne({ email: email });
    const workoutsCollection = mongoClient.db(dbName).collection('workouts');

    const newPost = {
      title,
      description,
      type,
      email:user.email,
      name:user.firstName+" "+user.lastName,
      createdAt: new Date(),
    };

    const result = await workoutsCollection.insertOne(newPost);
    res.status(201).send('Post submitted successfully.');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error submitting the post.');
  } finally {
    await mongoClient.close();
  }
});

app.get('/api/users/:userType/:userId', async (req, res) => {
  const { userType, userId } = req.params;
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const user = await userCollection.findOne({ _id: new ObjectId(userId), type: userType });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user details from MongoDB');
  } finally {
    await mongoClient.close();
  }
});








// Your other routes and app.listen() should remain the same




app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password, type } = req.body;

  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const existingUser = await userCollection.findOne({ email: email });

    if (existingUser) {
      return res.status(400).send('User already exists.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      type: type,
    };

    const result = await userCollection.insertOne(newUser);
    res.status(201).send('User registered successfully.');
  }  catch (error) {
    console.error(error);
    res.status(400).send('Error registering the user.');
  } finally {
    await mongoClient.close();
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await mongoClient.connect();
    const userCollection = mongoClient.db(dbName).collection(userCollectionName);
    const user = await userCollection.findOne({ email: email });

    if (user) {
      // Compare the provided password with the stored password
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // Create a JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email, type: user.type, name:user.firstName+''+user.lastName },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
        console.log("user details in Login", user);
        res.status(200).json({
          message: 'Login successful.',
          token: token,
          user: { id: user._id, email: user.email, type: user.type, name:user.firstName+''+user.lastName},
        });
      } else {
        res.status(401).send('Invalid password.');
      }
    } else {
      res.status(404).send('User not found.');
    }
  } catch (error) {
    console.error(error);
    res.status(400).send('Error Logging in.');
  } finally {
    await mongoClient.close();
  }
});








// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
