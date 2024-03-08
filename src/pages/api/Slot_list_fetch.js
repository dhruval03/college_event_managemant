// pages/Slot_list_fetch.js

import { getDatabase } from './db'; // Adjust the path as needed

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { Date } = req.query; // Get the date from query parameters
    
    try {
      const database = await getDatabase();
      const collection = database.collection('Slot_Booking_data');

      const existingRecords = await collection.find({ Date: Date }).toArray(); // Query database based on the date

      if (existingRecords.length > 0) {
        res.status(200).json(existingRecords);
      } else {
        res.status(200).json({ message: 'No bookings found for the selected date' });
      }
    } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ message: 'Error querying database' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
