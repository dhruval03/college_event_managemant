import { getDatabase } from './db'; // Adjust the path as needed

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { Date } = req.query; // Get the date from query parameters
    
    try {
      const database = await getDatabase();
      const slotBookingCollection = database.collection('Slot_Booking_data');
      const facultyCollection = database.collection('faculty_details');

      const bookingsWithFacultyName = await slotBookingCollection.aggregate([
        {
          $match: { Date: Date } // Filter bookings by date
        },
        {
          $lookup: {
            from: "faculty_details",
            localField: "facultyId",
            foreignField: "facultyId",
            as: "faculty" // Store the matched faculty details in an array called "faculty"
          }
        },
        {
          $unwind: "$faculty" // Deconstruct the array and get individual faculty details
        },
        {
          $project: {
            _id: 1, 
            facultyName: "$faculty.facultyName", // Include the facultyName field
            buildingId: 1,
            buildingName: 1,
            room: 1,
            Date: 1,
            Time: 1,
            Branch: 1,
            Semester: 1,
            Subject: 1,
            topicName: 1,
            isStudent:1,
            status:1,
          }
        }
      ]).toArray();

      if (bookingsWithFacultyName.length > 0) {
        res.status(200).json(bookingsWithFacultyName);
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
