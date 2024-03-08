import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider } from '@mui/system';
import TextField from '@mui/material/TextField';
import Navbar from '../components/navbar/nav';
import Footer from '../components/footer/Footer';
import { useSpring, animated } from 'react-spring';
import { useRouter } from 'next/router';


const theme = createTheme();

const Slot_booking = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [firstModalVisible, setFirstModalVisible] = useState(false);
  const [registeredRooms, setRegisteredRooms] = useState([]);
  const [buildingRoomInfo, setBuildingRoomInfo] = useState({
    buildingId: null,
    room: null,
    // Add other fields as needed
  });

  const [isVisible, setIsVisible] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topicName, setTopicName] = useState('');
  const router = useRouter(); // Use useRouter instead of useHistory

  const branches = ['IT', 'Civil', 'EC']; // Add your branch options
  const semesters = [1, 2, 3, 4, 5, 6]; // Add your semester options
  const subjects = {
    IT: {
      1: ['C', 'C++', 'EONS'],
      2: ['Subject2A', 'Subject2B', 'Subject2C'],
      3: ['Subject3A', 'Subject3B', 'Subject3C'],
      4: ['Subject4A', 'Subject4B', 'Subject4C'],
      5: ['Subject5A', 'Subject5B', 'Subject5C'],
      6: ['AAD', 'PHP', 'DSA'],
    },
    Civil: {
      1: ['C', 'Subject1Y', 'Subject1Z'],
      2: ['V', 'Subject2Y', 'Subject2Z'],
      3: ['I', 'Subject3Y', 'Subject3Z'],
      4: ['V', 'Subject4Y', 'Subject4Z'],
      5: ['I', 'Subject5Y', 'Subject5Z'],
      6: ['L', 'Subject6Y', 'Subject6Z'],
    },
    EC: {
      1: ['E', 'Subject1Q', 'Subject1R'],
      2: ['Subject2P', 'Subject2Q', 'Subject2R'],
      3: ['Subject3P', 'Subject3Q', 'Subject3R'],
      4: ['Subject4P', 'E', 'Subject4R'],
      5: ['Subject5P', 'Subject5Q', 'Subject5R'],
      6: ['C', 'C', 'Subject6R'],
    },
    // Add more subjects for each branch and semester as needed
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 } // Adjust the threshold as needed
    );

    // Start observing the image element
    observer.observe(document.getElementById('animated-image'));

    // Cleanup the observer on component unmount
    return () => observer.disconnect();
    setSelectedSubject('');
  }, [selectedBranch, selectedSemester,]);

  const imageAnimation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
  });

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
    setSelectedSemester('');
    setSelectedSubject('');
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const buildingData = [
    { id: 'A3', name: 'RPCP', rooms: ['601', '602', '603', '604', '605', '606', '607', '608', '609', '610'] },
    { id: 'A5', name: 'CSPIT-IT', rooms: ['601', '602', '603', '604', '605', '606', '607', '608', '609', '610'] },
    { id: 'A7', name: 'CSPIT-EC', rooms: ['601', '602', '603', '604', '605', '606', '607', '608', '609', '610'] },
    { id: 'A8', name: 'Pharmacy', rooms: ['601', '602', '603', '604', '605', '606', '607', '608', '609', '610'] },
    { id: 'A9', name: 'Depstar', rooms: ['601', '602', '603', '604', '605', '606', '607', '608', '609', '610'] },
    { id: 'A10', name: 'CAMPICA', rooms: ['601', '602', '603', '604', '605', '606', '607', '608', '609', '610'] },
    // Add more buildings and associated rooms as needed
  ];

  const handleBuildingClick = (buildingId) => {
    setFirstModalVisible(true);
    setSelectedBuilding(buildingId);
    setSelectedRoom(null);

  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room === selectedRoom ? null : room);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const checkAvailability = async () => {
    try {
      // Check if all required parameters are available
      if (!selectedBuilding || !selectedRoom || !selectedDate) {
        // alert("Please select building, room, and date.");
        return;
      }

      // Fetch slot availability data based on building ID, room, and date
      const url = `/api/Slot_data?Date=${selectedDate}&buildingId=${selectedBuilding}&room=${selectedRoom}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      if (!data || !data.bookedTimes) {
        throw new Error('Invalid response format');
      }

      let message = '';

      if (data.bookedTimes.length > 0) {
        message += `Some time slots are already booked for ${selectedDate} in 
Building ${selectedBuilding}, Room ${selectedRoom}:\n${data.bookedTimes.join('\n')}\n`;
      } else {
        message += `No time slots are booked for ${selectedDate} in Building ${selectedBuilding}, Room ${selectedRoom}.\n`;
      }

      const availableTimes = [
        '9:10 AM TO 10:10 AM',
        '10:10 AM TO 11:10 AM',
        '11:10 AM TO 12:10 PM',
        '12:10 PM TO 1:10 PM',
        '1:10 PM TO 2:10 PM',
        '2:20 PM TO 3:20 PM',
        '3:20 PM TO 4:20 PM'
      ];

      const filteredTimes = availableTimes.filter(time => !data.bookedTimes.includes(time));

      if (filteredTimes.length > 0) {
        message += `Available times for ${selectedDate} in Building ${selectedBuilding}, Room ${selectedRoom}:\n${filteredTimes.join('\n')}`;
      } else {
        message += `No available times for ${selectedDate} in Building ${selectedBuilding}, Room ${selectedRoom}.`;
      }

      alert(message);
    } catch (error) {
      console.error('Error checking availability:', error.message);
      // alert(`No time slots are booked for ${selectedDate} in Building ${selectedBuilding}, Room ${selectedRoom}.\n`);
    }
  };

  // Execute checkAvailability whenever any of the parameters change
  useEffect(() => {
    checkAvailability();
  }, [selectedBuilding, selectedRoom, selectedDate]);

  const handleSubmit = () => {
    setShowSecondModal(true);
    // Apply CSS class to hide main scrollbar
    document.body.classList.add('hide-scrollbar');
    setFirstModalVisible(false);
    setShowSecondModal(true);
    setBuildingRoomInfo({
      buildingId: selectedBuilding,
      room: selectedRoom,
      // Add other field values as needed
    });
  };

  const handleClose = () => {
    setFirstModalVisible(false);
    setSelectedBuilding(null);
    setSelectedRoom(null);
  };
  const handleCloseSecondModal = () => {
    setShowSecondModal(false);
    // Remove CSS class to show main scrollbar
    document.body.classList.remove('hide-scrollbar');
  };

  const handleTimeChange = (event) => {
    const newTime = event.target.value;
    setSelectedTime(newTime);
  };
  const isSubmitDisabled = selectedRoom === null;


  // Function to submit data
  const submitData = async () => {
    // Validation logic
    const requiredFields = [
      { name: 'Date', value: selectedDate },
      { name: 'Time Slot', value: selectedTime },
      { name: 'Select Branch', value: selectedBranch },
      { name: 'Select Semester', value: selectedSemester },
      { name: 'Select Subject', value: selectedSubject },
      { name: 'Topic Name', value: topicName },
    ];

    const emptyFields = requiredFields.filter(field => !field.value);

    if (emptyFields.length > 0) {
      // Display message indicating which fields are empty
      const emptyFieldNames = emptyFields.map(field => field.name).join(', ');
      alert(`Please fill in the following fields: ${emptyFieldNames}`);
    } else {
      // Redirect to Booking_list page with field data as query parameters
      try {
        const response = await fetch('/api/Slot_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            buildingId: buildingRoomInfo.buildingId,
            buildingName: buildingData.find((building) => building.id === buildingRoomInfo.buildingId)?.name,
            room: buildingRoomInfo.room,
            Date: selectedDate,
            Time: selectedTime,
            Branch: selectedBranch,
            Semester: selectedSemester,
            Subject: selectedSubject,
            topicName,
          }),
        });
        if (response.status === 201) {
          router.push('../home_page/student_home_page');  
        } else if (response.status === 400) {
          alert("Data is already booked for this date and time");
        }
        else {
          // Handle other error responses
          const data = await response.json();
          throw new Error(data.message || 'Error submitting form');
        }
      } catch (error) {
        // Handle fetch error
        console.error('Error submitting form:', error.message);
        alert('Error submitting form. Please try again later.');
      }
    }
  };

  // Call the function to retrieve booked times

  return (
    <div className="container-fluid p-0 position-relative">
      <Head>
        <title>Slot Booking</title>
      </Head>
        <Navbar />
      <div className="row">
        <div className="col-md-12 position-relative">
          <animated.img
            id="animated-image"
            src="/img/bg.jpg"
            alt="Full Screen Image"
            className="img-fluid"
            style={{
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              position: 'relative',
              ...imageAnimation,
            }}
          />
          {/* Six clickable rectangles */}
          <div
            className="clickable-rect"
            style={{ position: 'absolute', top: '38%', left: '20%', height: '26%', width: '19.5%' }}
            onClick={() => handleBuildingClick('A3')}
          ></div>
          <div
            className="clickable-rect"
            style={{ position: 'absolute', top: '25%', left: '6%', height: '16%', width: '14%' }}
            onClick={() => handleBuildingClick('A5')}
          ></div>
          <div
            className="clickable-rect"
            style={{ position: 'absolute', top: '26%', left: '22%', height: '11%', width: '22%' }}
            onClick={() => handleBuildingClick('A7')}
          ></div>
          <div
            className="clickable-rect"
            style={{ position: 'absolute', top: '39%', left: '61.5%', height: '21%', width: '12.5%' }}
            onClick={() => handleBuildingClick('A8')}
          ></div>
          <div
            className="clickable-rect"
            style={{ position: 'absolute', top: '25%', left: '57.5%', height: '11.5%', width: '11%' }}
            onClick={() => handleBuildingClick('A9')}
          ></div>
          <div
            className="clickable-rect"
            style={{ position: 'absolute', top: '14.5%', left: '54.5%', height: '9.5%', width: '8.5%' }}
            onClick={() => handleBuildingClick('A10')}
          ></div>

          {/* Add other clickable rectangles similarly */}
        </div>
      </div>

      {/* Bootstrap modal for displaying building and room information */}
      {selectedBuilding && (
        <div className={`modal ${firstModalVisible ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: firstModalVisible ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ backdropFilter: 'blur(10px)', backgroundColor: '#e0f2f1' }}>
              <div className="modal-header" style={{ backgroundColor: '#2196f3', color: 'white' }}>
                <h5 className="modal-title">Building Info</h5>
              </div>
              <div className="modal-body">
                <p style={{ color: '#000' }}>Building ID & Name: [{selectedBuilding}] {buildingData.find((building) => building.id === selectedBuilding)?.name}</p>
                {/* Display room information */}
                {/* Add clickable rectangles for rooms */}
                <div className="room-rectangles">
                  {buildingData
                    .find((building) => building.id === selectedBuilding)
                    .rooms.map((room) => (
                      <div
                        key={room}
                        className={`room-rectangle ${room === selectedRoom ? 'selected-room' : ''} ${registeredRooms.includes(room) ? 'disabled-room' : ''}`}
                        onClick={() => handleRoomClick(room)}
                        required
                      >
                        {room}
                      </div>
                    ))}
                </div>
              </div>
              <div className="modal-footer" style={{ backgroundColor: '#e0f2f1' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setFirstModalVisible(false)}
                  style={{ color: 'white', backgroundColor: '#2196f3' }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!selectedRoom} // Disable the Submit button if no room is selected
                  style={{ color: 'white', backgroundColor: '#2196f3' }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slot_booking_Details */}

      {showSecondModal && (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: '33%', maxHeight: '90%' }}>
            <div className="modal-content" style={{ backdropFilter: 'blur(10px)', backgroundColor: '#e0f2f1' }}>
              <div className="modal-header" style={{ backgroundColor: '#2196f3', color: 'white' }}>
                <h5 className="modal-title">Slot Booking</h5>
              </div>
              <div className="modal-body">
                <p style={{ color: '#000' }}>Building ID & Name: [{buildingRoomInfo.buildingId}] {buildingData.find((building) => building.id === buildingRoomInfo.buildingId)?.name}</p>
                <p style={{ color: '#000' }}>Room: {buildingRoomInfo.room}</p>

                {/* Date input field */}
                <div className="form-group">
                  <ThemeProvider theme={theme}>
                    <TextField
                      fullWidth
                      label="Date"
                      type="date"
                      id="dateInput"
                      InputLabelProps={{ shrink: true }}
                      value={selectedDate}
                      onChange={handleDateChange}
                      required
                    />
                  </ThemeProvider>
                </div>
                <br />

                {/* Select SLota_time dropdown */}

                <div className="form-group">
                  <TextField
                    id="selectTime"
                    select
                    label="Select Slot Time"
                    fullWidth
                    value={selectedTime}
                    onChange={handleTimeChange}
                    required
                  >
                    {/* Manually added menu items with time values */}
                    <MenuItem value="9:10 AM TO 10:10 AM" id='1' >9:10 AM TO 10:10 AM</MenuItem>
                    <MenuItem value="10:10 AM TO 11:10 AM" id='2' >10:10 AM TO 11:10 AM</MenuItem>
                    <MenuItem value="11:10 AM TO 12:10 PM" id='3' >11:10 AM TO 12:10 PM</MenuItem>
                    <MenuItem value="12:10 PM TO 1:10 PM" id='4' >12:10 PM TO 1:10 PM</MenuItem>
                    <MenuItem value="1:10 PM TO 2:10 PM" id='5' >1:10 PM TO 2:10 PM</MenuItem>
                    <MenuItem value="2:20 PM TO 3:20 PM" id='6'>2:20 PM TO 3:20 PM</MenuItem>
                    <MenuItem value="3:20 PM TO 4:20 PM" id='7' >3:20 PM TO 4:20 PM</MenuItem>
                    {/* You can add more menu items as needed */}
                  </TextField>

                </div>
                <br></br>
                <div className="form-group">
                  <TextField
                    id="branchSelect"
                    select
                    label="Select Branch"
                    fullWidth
                    value={selectedBranch}
                    onChange={handleBranchChange}
                    required
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        {branch}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <br></br>

                {/* Select Semester dropdown */}
                <div className="form-group">
                  <TextField
                    id="semesterSelect"
                    select
                    label="Select Semester"
                    fullWidth
                    value={selectedSemester}
                    onChange={handleSemesterChange}
                    disabled={!selectedBranch}
                    required
                  >
                    {semesters.map((semester) => (
                      <MenuItem key={semester} value={semester}>
                        {semester}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <br></br>

                {/* Select Subject dropdown */}
                <div className="form-group">
                  <TextField
                    id="subjectSelect"
                    select
                    label="Select Subject"
                    fullWidth
                    value={selectedSubject}
                    onChange={handleSubjectChange}
                    disabled={!selectedBranch || !selectedSemester}
                    required
                  >
                    {subjects && subjects[selectedBranch] && subjects[selectedBranch][selectedSemester]
                      ? subjects[selectedBranch][selectedSemester].map((subject) => (
                        <MenuItem key={subject} value={subject}>
                          {subject}
                        </MenuItem>
                      ))
                      : null}
                  </TextField>
                </div>
                <br></br>
                <TextField
                  label="Topic Name"
                  variant="outlined"
                  fullWidth
                  value={topicName}
                  onChange={e => setTopicName(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer" style={{ backgroundColor: '#e0f2f1' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseSecondModal} style={{ color: 'white', backgroundColor: '#2196f3' }}>
                  Close
                </button>
                <button type="submit" className="btn btn-secondary" onClick={submitData} style={{ color: 'white', backgroundColor: '#2196f3' }}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
      
          // .clickable-rect {
          //   border-radius: 15%; /* Make the rectangle circular */
          //   border: 1px solid #ccc;
          // }

        /* Styling for the backdrop blur effect */
        .modal-backdrop.show {
          backdrop-filter: blur(5px); /* Adjust the blur intensity */
        }

        /* Style for clickable rooms */
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin-bottom: 5px;
        }

        /* Styles for clickable room rectangles */
        .room-rectangles {
          display: flex;
          flex-wrap: wrap;
          margin-top: 15px;
          justify-content: center;
        }

        .modal-content {
          max-height: 98vh; /* Adjust as needed */
          overflow-y: scroll;
        }
        /* Hide the side line of the scrollbar */
.modal-content::-webkit-scrollbar {
  width: 0px; /* Set the width of the scrollbar */
}

        .room-rectangle {
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid #000;
          border-radius: 5px;
          padding: 10px;
          margin-right: 10px;
          margin-bottom: 10px;
          cursor: pointer;
          width: 80px;
          text-align: center; 
        }
        body {
          font-family: 'Arial', sans-serif;
          letter-spacing: 0.5px;
        }
        p {
          font-weight: normal;
          text-align: justify;
        }
        .selected-room {
          background-color: rgba(0, 0, 255, 0.5); /* Adjust the background color as needed */
        }
      `}</style>
  <Footer />
    </div >
  );
};

export default Slot_booking;