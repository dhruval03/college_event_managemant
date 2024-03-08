// pages/api/checkStudent.js

import { getDatabase } from './db'; // Adjust the path as needed
import session from 'express-session';

export const config = {
  api: {
    bodyParser: false,
  },
};
const crypto = require('crypto');

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');

const sessionMiddleware = session({
  secret: secretKey, // Change this to a secret key for session encryption
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3000, // Session timeout in milliseconds (1 hour)
  },
});

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    sessionMiddleware(req, res, async () => {
      if (req.method === 'GET') {
        const { studentId, password } = req.query; // Get student ID and password from query parameters

        try {
          if (!studentId || !password) {
            // Bad request - Missing student ID or password
            return res.status(400).json({ message: 'Student ID and password are required' });
          }

          const database = await getDatabase();
          const collection = database.collection('student_details');

          // Query the database for the student with the provided student ID
          const student = await collection.findOne({ studentId });

          if (!student) {
            // Student not found
            return res.status(404).json({ message: 'Invalid User ID and Password' });
          }

          // Compare the provided password with the password stored in the database
          if (student.password !== password) {
            // Passwords do not match
            return res.status(401).json({ message: 'Incorrect password' });
          }

          // Passwords match - Student authenticated
          req.session.studentId = studentId; // Store studentId in session
          res.status(200).json({ message: 'Student authenticated successfully', student });
        } catch (error) {
          console.error('Error authenticating student:', error);
          res.status(500).json({ message: 'Error authenticating student' });
        }
      } else if (req.method === 'POST') {
        const {
          studentId,
          studentName,
          emailID,
          password,
          module,
        } = req.body;

        try {
          const database = await getDatabase();
          const collection = database.collection('student_details');

          // Check if student already exists
          const existingStudent = await collection.findOne({
            $or: [{ studentId }, { emailID }],
          });

          if (existingStudent) {
            res.status(400).json({ message: 'Student already exists' });
            return;
          }

          // Insert the student data into MongoDB
          await collection.insertOne({
            studentId,
            studentName,
            emailID,
            password,
            module,
          });

          res.status(201).json({ message: 'Student added successfully' });
        } catch (error) {
          console.error('Error adding student:', error);
          res.status(500).json({ message: 'Error adding student' });
        }
      } else {
        res.status(405).json({ message: 'Method Not Allowed' });
      }

      resolve();
    });
  });
}
