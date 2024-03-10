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
      } else if (req.method === 'PUT') {
          parseJson(req, res, () => handleUpdateRequest(req, res));
      } else if (req.method === 'DELETE') {
          handleDeleteRequest(req, res);
      } else {
          res.status(405).json({ message: 'Method Not Allowed' });
      }
  });
}

async function handleGetRequest(req, res) {
  const { userId, password } = req.query;

  try {
    const database = await getDatabase();
    const collection = database.collection('admin_details');

    // Query the database for the admin with the provided admin ID
    const admin = await collection.findOne({ adminId: userId });

    if (!admin) {
      // Faculty not found
      return res.status(404).json({ message: 'Invalid User ID and Password' });
    }

    // Compare the provided password with the password stored in the database
    if (password !== admin.password) {
      // Passwords do not match
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Passwords match - Faculty authenticated
    req.session.userId = userId; // Store userId in session
    res.status(200).json({ message: 'Faculty authenticated successfully', adminId: admin.adminId });
  } catch (error) {
    console.error('Error authenticating admin:', error);
    res.status(500).json({ message: 'Error authenticating admin' });
  }
}

async function handlePostRequest(req, res) {
  const {
    adminId,
    adminName,
    emailID,
    password,
  } = req.body;

  try {
    const database = await getDatabase();
    const collection = database.collection('admin_details');

    // Check if admin already exists
    const existingFaculty = await collection.findOne({
      $or: [{ adminId }, { emailID }],
    });

    if (existingFaculty) {
      res.status(400).json({ message: 'Admin already exists' });
      return;
    }

    await collection.insertOne({
      adminId,
      adminName,
      emailID,
      password,
    });

    res.status(201).json({ message: 'Admin added successfully' });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ message: 'Error adding admin' });
  }
}

// PUT Method 
async function handleUpdateRequest(req, res) {
    const { id } = req.query;

    if (req.method === 'PUT') {
        try {
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: 'Status field is required' });
            }

            // Parse id to ObjectId type
            const ObjectId = require('mongodb').ObjectId;
            const objectId = new ObjectId(id);

            // Update the status of the document with the given id
            const database = await getDatabase();
            const collection = database.collection('Slot_Booking_data');
            const result = await collection.updateOne(
                { _id: objectId },
                { $set: { status } } // Update status dynamically
            );

            if (result.modifiedCount === 1) {
                return res.status(200).json({ message: 'Status updated successfully' });
            } else {
                return res.status(404).json({ message: 'Slot not found' });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}


// delete api call


async function handleDeleteRequest(req, res) {
  // Implement your DELETE request handling logic here
  try {
      const { id } = req.query;

      // Parse id to ObjectId type
      const ObjectId = require('mongodb').ObjectId;
      const objectId = new ObjectId(id);

      // Delete the record with the given id
      const database = await getDatabase();
      const collection = database.collection('Slot_Booking_data');
      const result = await collection.deleteOne({ _id: objectId });

      if (result.deletedCount === 1) {
          res.status(200).json({ message: 'Record deleted successfully' });
      } else {
          res.status(404).json({ message: 'Record not found' });
      }
  } catch (error) {
      console.error('Error deleting record:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}