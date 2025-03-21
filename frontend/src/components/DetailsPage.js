import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';

const DetailsPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/${id}`);
        setCar(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('Car not found');
        } else {
          setError('An error occurred while fetching car details');
        }
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    );
  }

  if (!car) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Car Details</h1>
      <pre>{JSON.stringify(car, null, 2)}</pre>
      <Button variant="contained" onClick={() => navigate(-1)}>
        Back
      </Button>
    </div>
  );
};

export default DetailsPage;
