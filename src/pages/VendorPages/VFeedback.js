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
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// @mui
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
  TableContainer,
  TablePagination,
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
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'rating', label: 'Rating', alignRight: false },
  { id: 'message', label: 'Message', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'image', label: 'Image', alignRight: false },
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

export default function VFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');

  async function feedbackDet() {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/feedback/feedback_get`, {}, { withCredentials: true });
      setFeedback(res.data);
      console.log(res.data);
      const allRatings = [...new Set(res.data.map((feedback) => feedback.rating))];
      setRatings(allRatings);
    } catch (error) {
      console.log('Error fetching students');
      console.log(error);
    }
  }
  useEffect(() => {
    feedbackDet();
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

  const filteredFeedbacks = feedback.filter((student) => {
    if (selectedRating && student.rating !== selectedRating) {
      return false;
    }

    return true;
  });
  const users = filteredFeedbacks.map((num, index) => ({
    id: num._id,
    name: num.name,
    userId: num.userId,
    rating: num.rating,
    message: num.message,
    email: num.email,
    image: num.image,
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;
  const filteredfeedbacks = applySortFilter(users, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredfeedbacks.length && !!filterName;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Function to handle opening the dialog box and setting the selected image
  const handleOpenDialog = (image) => {
    setSelectedImage(image.toString('base64'));
    setOpenDialog(true);
    console.log(image);
    console.log(selectedImage.toString('base64'));
  };

  // Function to handle closing the dialog box
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage('');
  };

  return (
    <>
      <Helmet>
        <title> Feedback Lists | Digimess Dinning System </title>
      </Helmet>

      <Container>
        <Typography margin={'1rem'} marginLeft={'0.5rem'} variant="h2" gutterBottom>
          All The Feedbacks
        </Typography>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
            <Select
              value={selectedRating}
              onChange={(event) => setSelectedRating(event.target.value)}
              displayEmpty
              renderValue={(selected) => (selected ? selected : 'All Ratings....')}
            >
              <MenuItem value="">All Ratings</MenuItem>
              {ratings.map((rating, index) => (
                <MenuItem key={index} value={rating}>
                  {rating}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredfeedbacks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, userId, rating, message, email, image } = row;
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, stud)} /> */}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{userId}</TableCell>
                        <TableCell align="left">{rating}</TableCell>
                        <TableCell align="left">{message}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">
                          {image && <Button onClick={() => handleOpenDialog(image)}>View Image</Button>}
                        </TableCell>
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

          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Image</DialogTitle>
            <DialogContent>
              {selectedImage && (
                <img src={`${selectedImage}`} alt="Selected" style={{ width: '100%' }} />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Container>
    </>
  );
}