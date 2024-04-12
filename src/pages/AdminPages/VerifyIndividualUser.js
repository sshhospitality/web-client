import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Helmet } from 'react-helmet-async';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  Table,
  Paper,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { handleCustomAlert } from '../../components/handleCustomAlert';
// functions
import { formatDate } from '../../utils/functions/date_format';
import { filter } from '../../utils/functions/filter_data';
// components
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
import SpinnerLoadingScreen from '../../components/SpinnerLoadingScreen';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'to', label: 'To', alignRight: false },
  { id: 'from', label: 'From', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'mode', label: 'Mode', alignRight: false },
  { id: 'rem', label: 'Remarks', alignRight: false },
  { id: 'deleteIcon', label: '', alignRight: false },
];

// ----------------------------------------------------------------------

export default function VerifyIndividualUser() {
  const cancelTokenSourceRef = useRef();
  const [txns, setTxns] = useState([]);
  const [userName, setUserName] = useState('');
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [newPage, setNewPage] = useState(1);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [selected, setSelected] = useState([]);
  const [id, setId] = useState('');

  useEffect(() => {
    // Parse the query parameters from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get('id');
    const page = searchParams.get('page');
    // Update state with the fetched query parameter
    if (page) {
      setNewPage(page);
    }
    if (query) {
      setId(query);
    }
  }, []);

  useEffect(() => {
    async function txnData() {
      setLoader(true);
      // Cancel the previous request, if there is one
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel('New request made');
      }

      // Create a new cancel token
      cancelTokenSourceRef.current = axios.CancelToken.source();

      try {
        const res = await axios.get(`http://localhost:5000/api/admin/transactions?id=${id}&page=${newPage}`, {
          cancelToken: cancelTokenSourceRef.current.token,
          withCredentials: true,
        });
        setTxns(res.data.transactions);
        setUserName(res.data.name);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else if (error.response.status === 401) {
          navigate('/login', { replace: true });
        } else console.log(error);
      } finally {
        setLoader(false);
      }
    }

    txnData();
    return () => {
      // Cancel the previous request, if there is one
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel('New request made');
      }
    };
  }, [id, newPage, navigate]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // const users = txns
  //   .sort((a, b) => (a.transaction_date < b.transaction_date ? -1 : 1))
  //   .map((num) => ({
  //     id: num._id,
  //     accountFrom: num.account_from,
  //     accountTo: num.account_to,
  //     amount: num.amount,
  //     trnsType: num.transaction_type,
  //     trnsMode: num.transaction_mode,
  //     trnsDate: formatDate(num.transaction_date),
  //     trnsRem: num.remarks,
  //   }));
  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = users.map((n) => n.name);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  // --:DO NOT DELETE THE BELOW  COMMENTED CODE, CAN BE USED ON LATER STAGE:--
  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
  //   }
  //   setSelected(newSelected);
  // };

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

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  // const filteredUsers = filter(users, order, orderBy, filterName);
  // if (order === 'desc' && orderBy === 'date') filteredUsers.reverse();
  // const isNotFound = !filteredUsers.length && !!filterName;

  const handleDelete = (transId) => {
    const confirmDelete = async () => {
      const result = window.confirm('Are you sure to delete?');
      if (result) {
        if (cancelTokenSourceRef.current) {
          cancelTokenSourceRef.current.cancel('New request made');
        }

        // Create a new cancel token
        cancelTokenSourceRef.current = axios.CancelToken.source();
        try {
          const res = await axios.post(
            `http://localhost:5000/api/admin/transactions/delete`,
            {
              id,
              transaction_id: transId,
            },
            {
              cancelToken: cancelTokenSourceRef.current.token,
              withCredentials: true,
            }
          );
          if (res.status === 200) {
            const newTxn = txns.filter((item) => item._id !== transId);
            setTxns(newTxn);
          }
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log('Request canceled');
          } else if (error.response.status === 401) {
            navigate('/login', { replace: true });
          } else console.log(error);
        }
        console.log(`Deleted ${transId}`);
      } else {
        console.log('Transaction not Deleted');
      }
    };
    confirmDelete();
  };

  const handleVerifyAll = () => {
    const confirmVerifyAll = async () => {
      const result = await window.confirm('Are you sure to Verify All?');
      if (result) {
        if (cancelTokenSourceRef.current) {
          cancelTokenSourceRef.current.cancel('New request made');
        }

        // Create a new cancel token
        cancelTokenSourceRef.current = axios.CancelToken.source();
        try {
          const res = await axios.post(
            `http://localhost:5000/api/admin/transactions/validate`,
            {
              id,
            },
            {
              withCredentials: true,
              cancelToken: cancelTokenSourceRef.current.token,
            }
          );
          if (res.status === 200) {
            setTxns([]);
          }
        } catch (error) {
          console.log(error);
        }
        console.log(`Verfied All`);
      } else {
        console.log('Transaction not Verified');
      }
    };
    confirmVerifyAll();
  };

  const handleTrackPrev = async () => {
    handleCustomAlert('Track Previous', 'Track Previous', 'success');
    // setLoader(true);
    // try {
    //   const res = await axios.post(
    //     'http://localhost:5000/api/',
    //     {
    //       mess: 'mess-kumar',
    //     },
    //     { withCredentials: true }
    //   );
    //   setTxn(res.data.data);
    // } catch (error) {
    //   if (error.response.status === 401) {
    //     navigate('/login', { replace: true });
    //   } else console.log(error);
    // } finally {
    //   setLoader(false);
    // }
  };
  const handleTrackNext = async () => {
    handleCustomAlert('Track Next', 'Track Next', 'Danger');
    // setLoader(true);
    // try {
    //   const res = await axios.post(
    //     'http://localhost:5000/api/',
    //     {
    //       mess: 'mess-kumar',
    //     },
    //     { withCredentials: true }
    //   );
    //   setTxn(res.data.data);
    // } catch (error) {
    //   if (error.response.status === 401) {
    //     navigate('/login', { replace: true });
    //   } else console.log(error);
    // } finally {
    //   setLoader(false);
    // }
  };
  return (
    <>
      <Helmet>
        <title> Student Details | IIT Bhilai Dinning System </title>
      </Helmet>
      <Container>
        <Typography margin={'1rem'} marginLeft={'0.5rem'} variant="h3" gutterBottom>
          {userName}
        </Typography>
        <Card>
          {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          </div> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }} component={Paper}>
              <Table>
              <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ref No.</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>Meal Type</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell>Meal Items</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {txns.map((txn) => (
                  <TableRow key={txn._id}>
                    <TableCell>{txn.transaction_ref_no}</TableCell>
                    <TableCell>{txn.timestamp}</TableCell>
                    <TableCell>{txn.account_from}</TableCell>
                    <TableCell>{txn.mealType}</TableCell>
                    <TableCell>{txn.transaction_mode}</TableCell>
                    <TableCell>{txn.meal_items.join(', ')}</TableCell>
                    <TableCell align="center">
                          <DeleteIcon
                            style={{ cursor: 'pointer', color: '#bb0303' }}
                            onClick={() => {
                              handleDelete(txn._id);
                            }}
                          />
                        </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
                {/* <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                /> */}
                {/* <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, trnsDate, accountFrom, trnsType, accountTo, trnsMode, amount, trnsRem } = row;
                    const selectedUser = selected.indexOf(trnsDate) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox" />

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {trnsDate}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{accountTo}</TableCell>

                        <TableCell align="left">{accountFrom}</TableCell>

                        <TableCell align="left">{amount}</TableCell>

                        <TableCell align="left">
                          <Label>{sentenceCase(trnsType)}</Label>
                        </TableCell>
                        <TableCell align="center">{trnsMode}</TableCell>
                        <TableCell align="center">{trnsRem}</TableCell>
                        <TableCell align="center">
                          <DeleteIcon
                            style={{ cursor: 'pointer', color: '#bb0303' }}
                            onClick={() => {
                              handleDelete(id);
                            }}
                          />
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
                )} */}
              </Table>
              {/* {loader && <SpinnerLoadingScreen />}
              {!loader && txn.length === 0 && (
                <div>
                  {' '}
                  <Typography
                    variant="h5"
                    style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    No Data Found
                  </Typography>
                </div>
              )} */}
            </TableContainer>
          </Scrollbar>

          <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={txns.length} // Assuming total count is received from backend
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Card>
        <div
          style={{
            margin: '20px 0',
            width: '100%',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div />
          <div style={{ position: 'relative', display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
            <Button
              variant="outlined"
              disabled={txns.length === 0}
              color={'secondary'}
              startIcon={<SkipPreviousIcon />}
              onClick={handleTrackPrev}
            >
              Track Previous
            </Button>
            <Button
              variant="outlined"
              disabled={txns.length === 0}
              color={'secondary'}
              endIcon={<SkipNextIcon />}
              onClick={handleTrackNext}
            >
              Track Next
            </Button>
          </div>

          <Button variant="contained" onClick={handleVerifyAll} disabled={txns.length === 0}>
            Verify All
          </Button>
        </div>
      </Container>
    </>
  );
}
