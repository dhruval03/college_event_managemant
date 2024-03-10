import { getDatabase } from '../db';
import session from 'express-session';
import bodyParser from 'body-parser';

export const config = {
  api: {
    bodyParser: false,
  },
};

const crypto = require('crypto');

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');

const sessionMiddleware = session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3000,
  },
});

const parseJson = bodyParser.json();

export default async function handler(req, res) {
  sessionMiddleware(req, res, async () => {
    if (req.method === 'GET') {
      handleGetRequest(req, res);
    } else if (req.method === 'POST') {
      parseJson(req, res, () => handlePostRequest(req, res));
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  });
}

async function handleGetRequest(req, res) {
  const { userId, password } = req.query;

  try {
    const database = await getDatabase();
    const collection = database.collection('faculty_details');

    // Query the database for the faculty with the provided faculty ID
    const faculty = await collection.findOne({ facultyId: userId });

    if (!faculty) {
      // Faculty not found
      return res.status(404).json({ message: 'Invalid User ID and Password' });
    }

    // Compare the provided password with the password stored in the database
    if (password !== faculty.password) {
      // Passwords do not match
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Passwords match - Faculty authenticated
    req.session.userId = userId; // Store userId in session
    res.status(200).json({ message: 'Faculty authenticated successfully', facultyId: faculty.facultyId });
  } catch (error) {
    console.error('Error authenticating faculty:', error);
    res.status(500).json({ message: 'Error authenticating faculty' });
  }
}

async function handlePostRequest(req, res) {
  const {
    facultyId,
    facultyName,
    emailID,
    password,
    module,
  } = req.body;

  try {
    const database = await getDatabase();
    const collection = database.collection('faculty_details');

    // Check if faculty already exists
    const existingFaculty = await collection.findOne({
      $or: [{ facultyId }, { emailID }],
    });

    if (existingFaculty) {
      res.status(400).json({ message: 'Faculty already exists' });
      return;
    }

    // Insert the faculty data into MongoDB
    await collection.insertOne({
      facultyId,
      facultyName,
      emailID,
      password, // Store password without hashing
      module,
    });

    res.status(201).json({ message: 'Faculty added successfully' });
  } catch (error) {
    console.error('Error adding faculty:', error);
    res.status(500).json({ message: 'Error adding faculty' });
  }
}