import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { format } from 'date-fns'; // Import format function from date-fns library

import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TextField,
  TableContainer,
  TablePagination,
  FormControl,
  InputLabel,
} from '@mui/material';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
// import USERLIST from '../../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'createdAt', label: 'Date', alignRight: false },
  { id: 'question', label: 'Question', alignRight: false },
  // { id: 'options', label: 'Options', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    query = query.toLowerCase(); // Convert query to lowercase for case-insensitive search
    return stabilizedThis
      .filter(([user]) =>
        Object.values(user).some((value) => {
          if (typeof value === 'string') {
            // If the value is a string, check if it contains the query
            return value.toLowerCase().includes(query);
          }
          if (typeof value === 'number') {
            // If the value is a number, convert it to a string and check
            return value.toString().includes(query);
          }
          // For other data types, skip the filter
          return false;
        })
      )
      .map(([user]) => user);
  }

  return stabilizedThis.map(([el]) => el);
}

export default function VPoll() {
  const [poll, setPoll] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOptionsDialogOpen, setIsOptionsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Function to open the create poll dialog
  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  // Function to close the create poll dialog
  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };
  async function pollDet() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/poll/poll`, { withCredentials: true });
      setPoll(res.data);
      console.log(res.data);
    } catch (error) {
      console.log('Error fetching students');
      console.log(error);
    }
  }
  useEffect(() => {
    pollDet();
  }, []);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const polls = poll.map((num, index) => ({
    id: num._id,
    title: num.title,
    question: num.question,
    options: num.options,
    createdAt: num.createdAt,
  }));
  const handleOpenOptionsDialog = (options) => {
    setSelectedOptions(options);
    setIsOptionsDialogOpen(true);
  };

  const handleCloseOptionsDialog = () => {
    setIsOptionsDialogOpen(false);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = polls.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - polls.length) : 0;
  const filteredPolls = applySortFilter(polls, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredPolls.length && !!filterName;
  // Inside your component
  const [newPollData, setNewPollData] = useState({
    title: '',
    question: '',
    options: [''], // Initial empty option
  });

  // Function to handle input changes in the form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPollData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle adding new option fields
  const handleAddOption = () => {
    setNewPollData((prevData) => ({
      ...prevData,
      options: [...prevData.options, ''], // Add new empty option
    }));
  };

  // Function to handle input changes in the option fields
  const handleOptionChange = (event, index) => {
    const { value } = event.target;
    setNewPollData((prevData) => ({
      ...prevData,
      options: prevData.options.map((option, i) => (i === index ? value : option)),
    }));
  };

  // Function to handle form submission (POST request to create the poll)
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/poll/create`, newPollData, {
        withCredentials: true,
      });
      setNewPollData({
        title: '',
        question: '',
        options: [''],
      });
      setIsCreateDialogOpen(false);
      // Fetch the updated list of polls
      pollDet();
    } catch (error) {
      console.error('Error creating poll:', error);
      // Handle error (e.g., display error message to the user)
    }
  };
  return (
    <>
      <Helmet>
        <title> Vendor Poll Page | Digimess Dinning System </title>
      </Helmet>

      <Container>
        <Typography margin={'1rem'} marginLeft={'0.5rem'} variant="h2" gutterBottom>
          Polls
        </Typography>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <Button onClick={handleOpenCreateDialog} variant="contained" color="primary">
              Create Poll
            </Button>
          </div>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={polls.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredPolls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, title, question, options, createdAt } = row;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        onClick={() => handleOpenOptionsDialog(options)}
                      >
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, stud)} /> */}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{format(new Date(createdAt), 'MMMM dd, yyyy HH:mm:ss')}</TableCell>
                        <TableCell align="left">{question}</TableCell>
                        {/* <TableCell align="left">{options}</TableCell> */}
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
      <Dialog open={isOptionsDialogOpen} onClose={handleCloseOptionsDialog}>
        <DialogTitle>Options and Frequencies</DialogTitle>
        <DialogContent>
          {/* Render options and their frequencies */}
          <TableContainer>
            <Table>
              <TableBody>
                {selectedOptions.map((option, index) => (
                  <TableRow key={index}>
                    <TableCell>{option.option}</TableCell>
                    <TableCell>{option.frequency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOptionsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog}>
        <DialogTitle>Create Poll</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            name="title"
            label="Title"
            value={newPollData.title}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            name="question"
            label="Question"
            value={newPollData.question}
            onChange={handleInputChange}
            margin="normal"
          />
          {newPollData.options.map((option, index) => (
            <TextField
              key={index}
              fullWidth
              label={`Option ${index + 1}`}
              value={option}
              onChange={(event) => handleOptionChange(event, index)}
              margin="normal"
            />
          ))}
          <Button onClick={handleAddOption} variant="outlined" sx={{ mt: 1, mb: 2 }}>
            Add Option
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create Poll
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
