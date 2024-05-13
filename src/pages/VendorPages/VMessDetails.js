import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Typography, Tabs, Tab, TextField, Button, Grid, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// ----------------------------------------------------------------------

export default function VendorMessDetails() {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [messDetails, setMessDetails] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/admin/getadmindetails`, { withCredentials: true });
      const data = response.data;
      console.log(data);
      const vendorRepresentatives = data.filter((item) => item.Position === 'vendor_representative');
      const studentRepresentatives = data.filter((item) => item.Position === 'student_representative');
      setMessDetails({ vendorRepresentatives, studentRepresentatives });
    } catch (error) {
      console.error('Error fetching mess details:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (index, name, number) => {
    setEditIndex(index);
    setEditName(name);
    setEditNumber(number);
  };
  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/admin/deleteRepresentative/${id}`, { withCredentials: true });
      // Refresh data after delete
      fetchData();
    } catch (error) {
      console.error('Error deleting representative:', error);
    }
  };
  const handleEditSave = async (id,positionnew) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/admin/editadmindetails/${id}`,
        {
          position:positionnew,
          name: editName,
          number: editNumber,
        },
        { withCredentials: true }
      );
      fetchData(); // Refresh the data after updating
      setEditIndex(null);
    } catch (error) {
      console.error('Error updating representative:', error);
    }
  };

  const handleAddNew = async (positionnew) => {
    try {
      const newPerson = {
        position: positionnew,
        name: newName,
        number: newNumber,
      };

      // Create an array with the new person
      const persons = [newPerson];

      // Send the request with the array of persons
      await axios.post(
        `${process.env.REACT_APP_API}/admin/admindetails`,
        { persons },
        {
          withCredentials: true,
        }
      );

      // Refresh the data
      fetchData();

      // Clear the input fields
      setNewName('');
      setNewNumber('');
    } catch (error) {
      console.error('Error adding new mess details:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Mess Committee Details | Digimess Dining System</title>
      </Helmet>

      <Container>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '150%',
              mx: 'auto',
              p: 4,
              borderRadius: '12px',
              boxShadow: 6,
              height: 'auto',
            }}
          >
            <Box sx={{ p: 4 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h3" align="center" mt={2} mb={2}>
                  Mess Committee Details
                </Typography>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Vendor Representative" />
                  <Tab label="Student Representative" />
                </Tabs>
              </Box>

              <Box sx={{ p: 4 }}>
                {value === 0 && (
                  <>
                    {messDetails &&
                      messDetails.vendorRepresentatives.map((person, index) => (
                        <div key={person._id}>
                          {editIndex === index ? (
                            <>
                              <TextField
                                fullWidth
                                label="Name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                sx={{ mb: 1 }}
                              />
                              <TextField
                                fullWidth
                                label="Number"
                                value={editNumber}
                                onChange={(e) => setEditNumber(e.target.value)}
                                sx={{ mb: 2 }}
                              />
                              <Button variant="contained" onClick={() => handleEditSave(person._id,"vendor_representative")} sx={{ mr: 1 }}>
                                Save
                              </Button>
                              <Button variant="contained" onClick={() => setEditIndex(null)}>
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Typography variant="h5" align="left" mt={4} mb={1}>
                                {person.Name}
                              </Typography>
                              <Typography variant="subtitle1" align="left" mb={2}>
                                {person.Number}
                              </Typography>
                              <Button variant="contained" onClick={() => handleEdit(index, person.Name, person.Number)}>
                                Edit
                              </Button>
                              <IconButton onClick={() => handleDeleteClick(person._id)}>
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </div>
                      ))}
                    <Typography variant="h5" align="left" mt={4} mb={1}>
                      Add New Representative
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Name"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          sx={{ mb: 1 }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Number"
                          value={newNumber}
                          onChange={(e) => setNewNumber(e.target.value)}
                          sx={{ mb: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button variant="contained" onClick={() => handleAddNew('vendor_representative')}>
                          Add New
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
                <Box sx={{ p: 4 }}>
                  {value === 1 && (
                    <>
                      {messDetails &&
                        messDetails.studentRepresentatives.map((person, index) => (
                          <div key={person._id}>
                            {editIndex === index ? (
                              <>
                                <TextField
                                  fullWidth
                                  label="Name"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  sx={{ mb: 1 }}
                                />
                                <TextField
                                  fullWidth
                                  label="Number"
                                  value={editNumber}
                                  onChange={(e) => setEditNumber(e.target.value)}
                                  sx={{ mb: 2 }}
                                />
                                <Button variant="contained" onClick={() => handleEditSave(person._id,"student_representative")} sx={{ mr: 1 }}>
                                  Save
                                </Button>
                                <Button variant="contained" onClick={() => setEditIndex(null)}>
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Typography variant="h5" align="left" mt={4} mb={1}>
                                  {person.Name}
                                </Typography>
                                <Typography variant="subtitle1" align="left" mb={2}>
                                  {person.Number}
                                </Typography>
                                <Button
                                  variant="contained"
                                  onClick={() => handleEdit(index, person.Name, person.Number)}
                                >
                                  Edit
                                </Button>
                                <IconButton onClick={() => handleDeleteClick(person._id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                          </div>
                        ))}
                      <Typography variant="h5" align="left" mt={4} mb={1}>
                        Add New Representative
                      </Typography>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            sx={{ mb: 1 }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Number"
                            value={newNumber}
                            onChange={(e) => setNewNumber(e.target.value)}
                            sx={{ mb: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button variant="contained" onClick={() => handleAddNew('student_representative')}>
                            Add New
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Box>
                {/* Add similar code for student representatives */}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
