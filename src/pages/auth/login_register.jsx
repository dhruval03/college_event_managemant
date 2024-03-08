import React from 'react';
import styles from '../../styles/login_register.module.css';
import { TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get user inputs
    const userId = e.target.elements.userId.value.trim();
    const password = e.target.elements.password.value.trim();

    // Validate user inputs
    if (!userId || !password) {
      // Display error message for empty fields
      console.error('Please fill in all fields');
      return;
    }

    try {
      // Send a GET request to the login API endpoint with query parameters
      const response = await fetch(`/api/student_api?studentId=${userId}&password=${password}`);

      const data = await response.json();

      if (response.ok) {
        // Login successful, set authenticated flag in session storage
        sessionStorage.setItem('authenticated', 'true');

        // Redirect to home page
        router.push('/home_page/student_home_page');
      } else {
        // Display error message for failed login attempt
        console.error(data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred during login');
      // Display error message for failed request
    }
  };

  const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'black', // Set border color to black
        borderWidth: '2.2px', // Increase border width
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black', // Set border color to black when focused
      },
    },

    marginBottom: theme.spacing(2), // Adjust the spacing between text fields
    '& input': {
      fontSize: '18px',
      color: 'black',
      textShadow: '0 0 0 rgba(0, 0, 0, 1)',
      // Adjust the font size and color of the input text
    },
    '& label[data-id="password-label"]': {
      fontSize: '18px',
      color: 'black',
      textShadow: '0 0 0 rgba(0, 0, 0, 1)', // Adjust the font size and color of the label text for the Password TextField
    },

    '@media (max-width: 768px)': { // Adjust styles for screens smaller than or equal to 768px width
      '& input': {
          fontSize: '16px', // Adjust input font size for smaller screens
      },
      '& label': {
          fontSize: '16px', // Adjust label font size for smaller screens
      },
  },
    '@media (max-width: 1108px)': { // Adjust styles for screens smaller than or equal to 768px width
      '& input': {
          fontSize: '16px', // Adjust input font size for smaller screens
      },
      '& label': {
          fontSize: '16px', // Adjust label font size for smaller screens
      },
  },
  }));

  return (
    <div className={`${styles.container} full-width`}>
      <form className={`m-2 ${styles.login}`} onSubmit={handleSubmit} method="POST">
        <h3>Login Form</h3>
        <img className="logo" style={{ maxWidth: '42%', width: 'auto', height: 'auto', marginBottom: '4%', marginLeft: 'auto', marginRight: 'auto', display: 'block' }} src="/img/login_register_logo-removebg.png" id="logo" />
        <div>
          <CustomTextField
            name="userId"
            label="User ID"
            variant="outlined"
            fullWidth
            required
            InputLabelProps={{
              'data-id': 'password-label', // Set a custom data attribute to identify the label for the Password TextField
            }}
          />
          <CustomTextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            InputLabelProps={{
              'data-id': 'password-label', // Set a custom data attribute to identify the label for the Password TextField
            }}
          />
        </div>
        <a href='' className={styles.forgetPassword}>Forget Password</a>
        <div style={{ textAlign: 'center' }}>
          <Button type="submit" variant="outlined" style={{ textShadow: '0 0 0 rgba(0, 0, 0, 1)', fontSize: '20px', width: '151px', marginTop: '20px', color: '#000000', borderColor: '#000000' }}>
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
