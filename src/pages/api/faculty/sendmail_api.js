import nodemailer from 'nodemailer';
import { getDatabase } from '../db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { facultyId, subject, text } = req.body;

    // Fetch faculty details from the database using facultyId
    const database = await getDatabase();
    const collection = database.collection('faculty_details');
    const faculty = await collection.findOne({ facultyId });

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const { emailID } = faculty;

    // Create transporter object using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Change to your email service provider
      auth: {
        user: emailID, // Use faculty's email
        pass: 'zfziuvwhdogvobyn', // Change to the faculty's email password
      },
    });

    // Send email
    await transporter.sendMail({
      from: emailID, // Use faculty's email as the 'from' address
      to: 'cccdecv@gmail.com', // Change to recipient email
      subject,
      text,
    });

    console.log('Email sent successfully');

    // Respond to the client
    res.status(201).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).json({ message: 'Error sending email' });
  }
}
