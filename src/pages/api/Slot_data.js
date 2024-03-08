import { getDatabase } from './db'; // Adjust the path as needed

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      buildingId,
      buildingName,
      room,
      Date,
      Time,
      Branch,
      Semester,
      Subject,
      topicName,
    } = req.body;

    try {
      const database = await getDatabase();
      const collection = database.collection('Slot_Booking_data');

      // Check if data already exists based on buildingId, room, selectedDate, and selectedTime
      const existingRecords = await collection.find({ 
        buildingId, 
        room, 
        Date, 
        Time 
      }).toArray();
      
      if (existingRecords.length > 0) {
        // Extrzact booked times from existing records
        const bookedTimes = existingRecords.map(record => record.Time);
        
        // Return booked times in the response
        res.status(400).json({ 
          message: `Slot already booked for the following times on ${Date}: ${bookedTimes.join(', ')}`
        });
        return;
      }
      
      // Insert the booking data into MongoDB
      await collection.insertOne({
        buildingId,
        buildingName,
        room,
        Date,
        Time,
        Branch,
        Semester,
        Subject,
        topicName,
      });

      res.status(201).json({ message: 'Form submitted successfully' });
    } catch (error) {
      console.error('Error submitting form:', error);
      res.status(500).json({ message: 'Error submitting form' });
    }
  } else if (req.method === 'GET') {
    const { buildingId, room, Date } = req.query; // Get buildingId, room, and Date from query parameters
    
    try {
      const database = await getDatabase();
      const collection = database.collection('Slot_Booking_data');

      const existingRecords = await collection.find({ buildingId, room, Date }).toArray(); // Query database based on all three parameters

      if (existingRecords.length > 0) {
        const bookedTimes = existingRecords.map(record => record.Time);
        res.status(200).json({ bookedTimes });
      } else {
        res.status(200).json({ message: 'No bookings found for the selected date, building, and room' });
      }
    } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ message: 'Error querying database' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}