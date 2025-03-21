import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const DataGridComponent = () => {
  const [rowData, setRowData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColumn, setFilterColumn] = useState('Brand');
  const [filterCriteria, setFilterCriteria] = useState('contains');
  const [filterValue, setFilterValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await axios.get('http://localhost:5000/api/cars');
    setRowData(response.data);
  };

  const handleSearch = async () => {
    try {
      console.log(searchQuery); // Log the search query for debugging
      const response = await axios.get(`http://localhost:5000/api/cars/search?q=${searchQuery}`);
      setRowData(response.data); // Update the grid with search results
    } catch (error) {
      console.error('Error searching cars:', error);
    }
  };

  const handleResetSearch = async () => {
    setSearchQuery(''); // Clear the search query
    fetchData(); // Fetch all data again
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/cars/filter?column=${filterColumn}&criteria=${filterCriteria}&value=${filterValue}`
      );
      setRowData(response.data);
    } catch (error) {
      console.error('Error filtering cars:', error);
    }
  };

  const columnDefs = [
    { headerName: 'Brand', field: 'Brand' },
    { headerName: 'Model', field: 'Model' },
    { headerName: 'Acceleration (s)', field: 'AccelSec' },
    { headerName: 'Top Speed (Km/h)', field: 'TopSpeed_KmH' },
    { headerName: 'Range (Km)', field: 'Range_Km' },
    { headerName: 'Efficiency (Wh/Km)', field: 'Efficiency_WhKm' },
    { headerName: 'Fast Charge (Km/h)', field: 'FastCharge_KmH' },
    { headerName: 'Rapid Charge', field: 'RapidCharge' },
    { headerName: 'Power Train', field: 'PowerTrain' },
    { headerName: 'Plug Type', field: 'PlugType' },
    { headerName: 'Body Style', field: 'BodyStyle' },
    { headerName: 'Segment', field: 'Segment' },
    { headerName: 'Seats', field: 'Seats' },
    { headerName: 'Price (Euro)', field: 'PriceEuro' },
    { headerName: 'Date', field: 'Date' },
    {
      headerName: 'Actions',
      cellRenderer: (params) => (
        <div>
          <Button variant="contained" color="primary" onClick={() => handleView(params.data)}>
            View
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleDelete(params.data)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleView = (data) => {
    navigate(`/details/${data._id}`);
  };

  const handleDelete = async (data) => {
    try {
      await axios.delete(`http://localhost:5000/api/cars/${data._id}`);
      fetchData(); // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  return (
    <div>
      <h1>Car Details </h1>
      <h5>Number of Cars: {rowData.length}</h5>

      {/* Search Input */}
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginLeft: '10px' }}>
          Search
        </Button>
        <Button variant="contained" color="secondary" onClick={handleResetSearch} style={{ marginLeft: '10px' }}>
          Reset
        </Button>
      </div>

      {/* Filter Inputs */}
      <div style={{ marginBottom: '20px' }}>
        <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: '120px' }}>
          <InputLabel>Column</InputLabel>
          <Select
            value={filterColumn}
            onChange={(e) => setFilterColumn(e.target.value)}
            label="Column"
          >
            <MenuItem value="Brand">Brand</MenuItem>
            <MenuItem value="Model">Model</MenuItem>
            <MenuItem value="AccelSec">Acceleration (s)</MenuItem>
            <MenuItem value="TopSpeed_KmH">Top Speed (Km/h)</MenuItem>
            <MenuItem value="Range_Km">Range (Km)</MenuItem>
            <MenuItem value="Efficiency_WhKm">Efficiency (Wh/Km)</MenuItem>
            <MenuItem value="FastCharge_KmH">Fast Charge (Km/h)</MenuItem>
            <MenuItem value="RapidCharge">Rapid Charge</MenuItem>
            <MenuItem value="PowerTrain">Power Train</MenuItem>
            <MenuItem value="PlugType">Plug Type</MenuItem>
            <MenuItem value="BodyStyle">Body Style</MenuItem>
            <MenuItem value="Segment">Segment</MenuItem>
            <MenuItem value="Seats">Seats</MenuItem>
            <MenuItem value="PriceEuro">Price (Euro)</MenuItem>
            <MenuItem value="Date">Date</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: '120px' }}>
          <InputLabel>Criteria</InputLabel>
          <Select
            value={filterCriteria}
            onChange={(e) => setFilterCriteria(e.target.value)}
            label="Criteria"
          >
            <MenuItem value="contains">Contains</MenuItem>
            <MenuItem value="equals">Equals</MenuItem>
            <MenuItem value="starts with">Starts With</MenuItem>
            <MenuItem value="ends with">Ends With</MenuItem>
            <MenuItem value="is empty">Is Empty</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Value"
          variant="outlined"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleFilter} style={{ marginLeft: '10px' }}>
          Filter
        </Button>
      </div>

      {/* DataGrid */}
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          modules={[ClientSideRowModelModule]}
        />
      </div>
    </div>
  );
};

export default DataGridComponent;
