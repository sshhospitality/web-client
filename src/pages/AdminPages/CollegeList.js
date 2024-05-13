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
  { id: 'cid', label: 'CId', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'phone', label: 'Phone Number', alignRight: false },
  { id: 'Actions', label: 'Actions', alignRight: false },
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

export default function CollegeList() {
  const [college, setCollege] = useState([]);

  async function collegeDet() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/admin/college_get`,{ withCredentials: true });
      setCollege(res.data);
    } catch (error) {
      console.log('Error fetching colleges');
      console.log(error);
    }
  }
  useEffect(() => {
    collegeDet();
  }, []);
  // console.log(USERLIST)

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});

  const handleOpenMenu = (event, row) => {
    setSelected(row);
    // console.log("hee",row);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const colleges = college.map((num, index) => ({
    id: num._id,
    name: num.name,
    cid: num.cid,
    address: num.address,
    phone: num.phone,
  }));
  const handleUserClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedDetails({
      ...editedDetails,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      // Call your PUT request to update the user details
      console.log(editedDetails);
      await axios.post(`${process.env.REACT_APP_API}/college/college_update/${selected.id}`, editedDetails, {
        withCredentials: true,
      });
      // Close the dialog after successful update
      setIsEditDialogOpen(false);
      collegeDet();
      // Optionally, you may want to refetch the user list to reflect the changes immediately
    } catch (error) {
      console.error('Error updating user details:', error);
      // Handle error appropriately (e.g., display error message)
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = colleges.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };


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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - colleges.length) : 0;
  const filteredColleges = applySortFilter(colleges, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredColleges.length && !!filterName;

  const handleUserDelete = () => {
    try {
      // Call your DELETE request to delete the user
      console.log(selected.id);
      axios.delete(`${process.env.REACT_APP_API}/college/college_del/${selected.id}`, { withCredentials: true });
      // Close the dialog after successful deletion
      handleCloseMenu();
      collegeDet();
      // Optionally, you may want to refetch the user list to reflect the changes immediately
    } catch (error) {
      console.error('Error deleting user:', error);
      // Handle error appropriately (e.g., display error message)
    }
  };

  const exportPDF = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape

    // eslint-disable-next-line new-cap
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = 'Student List';
    const headers = [['Name', 'Address', 'Phone', 'CID']];

    const data = college.map((student) => [
      student.name,
      student.address,
      student.phone,
      student.cid,
    ]);

    const content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, 40, 40);
    autoTable(doc, content);

    doc.save('College List.pdf');
  };
  return (
    <>
      <Helmet>
        <title> College List Page | Digimess Dinning System </title>
      </Helmet>

      <Container>
        <Typography margin={'1rem'} marginLeft={'0.5rem'} variant="h2" gutterBottom>
          All The Colleges
        </Typography>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <Button
              variant="outlined"
              style={{ margin: '15px 2rem', height: '2.5rem', minWidth: '140px' }}
              onClick={exportPDF}
            >
              Download as PDF
            </Button>
          </div>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={colleges.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredColleges.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, cid,phone, address } = row;

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

                        <TableCell align="left">{cid}</TableCell>
                        <TableCell align="left">{address}</TableCell>
                        <TableCell align="left">{phone}</TableCell>
                        <TableCell align="left">
                          <IconButton onClick={(event) => handleOpenMenu(event, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
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
            count={colleges.length}
            // count={"10"}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => handleUserClick()}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => handleUserDelete()}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <Dialog open={isEditDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit User Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            name="name"
            fullWidth
            value={editedDetails.name || selected?.name || ''}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="cid"
            label="College ID"
            type="text"
            name="cid"
            fullWidth
            value={editedDetails.cid || selected?.cid || ''}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            type="text"
            name="address"
            fullWidth
            value={editedDetails.address || selected?.address || ''}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="phone"
            label="Phone Number"
            type="number"
            name="phone"
            fullWidth
            value={editedDetails.phone || selected?.phone || ''}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
