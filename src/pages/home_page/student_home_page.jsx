import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/nav';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Button, TextField } from '@mui/material';
import Footer from '../components/footer/Footer';
import { useRouter } from 'next/router';

const HomePage = () => {
    const router = useRouter();

    // State to track the viewport dimensions
    const [viewportDimensions, setViewportDimensions] = useState({
        width: (typeof window !== 'undefined') ? window.innerWidth : 0,
        height: (typeof window !== 'undefined') ? window.innerHeight : 0
    });

    // Example data for the table
    const [data, setData] = useState([]);

    // Function to fetch data from the server
    const fetchData = async (selectedDate = null) => {
        try {
            const currentDate = new Date();
            const istOffset = 5.5 * 60 * 60 * 1000; // Indian Standard Time offset in milliseconds
            const istDate = new Date(currentDate.getTime() + istOffset);
            
            const date = selectedDate ? selectedDate : istDate.toISOString().split('T')[0];
            const response = await fetch(`/api/Slot_list_fetch?Date=${date}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error.message);
            // Handle error, e.g., show error message
        }
    };

    // Slick settings
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
    };

    // Fetch data with the current date on component mount
    useEffect(() => {
        // Check if user is authenticated
        if (!sessionStorage.getItem('authenticated')) {
            router.push('/auth/login_register'); // Redirect to login page if not authenticated
        }

        fetchData();

        // Set up interval to fetch data periodically
        const interval = setInterval(() => {
            fetchData();
        }, 60000); // Fetch data every 1 minute

        // Clean up interval on unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container-fluid px-0 slider">
                <div className="row mx-0">
                    <div className="col px-0">
                        <Slider {...settings} className="slider" >
                            <div>
                                <img src="/img/home_slider/slider_2.jpeg" alt="Slide 1" className="img-fluid slider-image" />
                            </div>
                            <div>
                                <img src="/img/home_slider/slider_1.jpeg" alt="Slide 2" className="img-fluid slider-image" />
                            </div>
                            <div>
                                <img src="/img/home_slider/slider_3.jpeg" alt="Slide 3" className="img-fluid slider-image" />
                            </div>
                        </Slider>
                        <div className="half-inside-slider">
                            <SlotSearchForm fetchData={fetchData} />
                        </div>
                        <div className='slot_dtail_table'>
                            <h3>Slot Details:</h3>
                            <DataTable data={data} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const SlotSearchForm = ({ fetchData }) => {
    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleCheckSlot = () => {
        fetchData(selectedDate);
    };

    return (
        <div className="slot-search-form-area">
            <div className="container-fluid">
                <div className="slot-search-form">
                    <form action="#" method="post">
                        <div className="row justify-content-between align-items-end">
                            <div className="col-12 col-md-6 col-lg-6">
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
                            </div>
                            <div className="col-12 col-md-6 col-lg-6">
                                <Button variant="outlined" onClick={handleCheckSlot}>Check Slot</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const DataTable = ({ data }) => {
    return (
        <div className="table-responsive">
            <table className="table table-bordered table-striped custom-table">
                <thead>
                    <tr>
                        <th>Sr.No.</th>
                        <th>Faculty Name</th>
                        <th>Building Name</th>
                        <th>Room No.</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Branch</th>
                        <th>Semester</th>
                        <th>Subject</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.Faculty_name}</td>
                            <td>{`${row.buildingId}-${row.buildingName}`}</td>
                            <td>{row.room}</td>
                            <td>{row.Date}</td>
                            <td>{row.Time}</td>
                            <td>{row.Branch}</td>
                            <td>{row.Semester}</td>
                            <td>{row.Subject}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HomePage;
