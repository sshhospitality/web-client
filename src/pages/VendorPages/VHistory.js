import { useEffect, useState, useRef, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Typography,
  Button,
  Paper,
  Card,
  TablePagination,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LoadingContext } from '../../components/LoadingContext';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// functions
import { exportPDF } from '../../utils/functions/pdf_download';
// components
import { handleCustomAlert } from '../../components/handleCustomAlert';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Select, MenuItem } from '@mui/material';
dayjs.extend(utc);
dayjs.extend(timezone);

export default function VHistory() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const cancelTokenSourceRef = useRef();

  const [txn, setTxn] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const [txnTo, setTxnTo] = useState(dayjs());
  const [txnFrom, setTxnFrom] = useState(dayjs().subtract(1, 'week').add(1, 'day'));

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');
  const [filteredTransaction, setFilteredTransaction] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [totalTransactions, setTotalTransactions] = useState(0);
  const { setIsLoading } = useContext(LoadingContext);
  useEffect(() => {
    async function fetchTransactions() {
      try {
        console.log(txnFrom);
        const res = await axios.post(
          `${process.env.REACT_APP_API}/department/list_of_dept_txns?page=${page + 1}`,
          {
            from: txnFrom,
            to: txnTo,
          },
          { withCredentials: true }
        );
        setTransactions(res.data.transactions);
        setFilteredTransaction(res.data.transactions);
        setTotalTransactions(res.data.totalDeptTransactions);
        console.log(res.data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }
    fetchTransactions();
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setFilterName(searchTerm); // Update filter value
    setFilteredTransaction(
      transactions.filter((transaction) => transaction.departmentDetails.name.toLowerCase().includes(searchTerm))
    );
  };

  const handleStatusChange = async (event, transactionId) => {
    const newStatus = event.target.value;
    console.log(newStatus);
    try {
      await axios.post(`${process.env.REACT_APP_API}/department/depttxn_update/${transactionId}`, {
        status: newStatus
      },
      { withCredentials: true }  
    );
      // Assuming you need to update the transactions list after changing the status
      const updatedTransactions = transactions.map(transaction =>
        transaction._id === transactionId ? { ...transaction, status: newStatus } : transaction
      );
      setTransactions(updatedTransactions);
      setFilteredTransaction(updatedTransactions); // Update filtered transactions if necessary
    } catch (error) {
      console.error('Error updating status:', error);
      // Handle error
    }
  };
  

  const handleUpdate = async () => {
    // Cancel the previous request, if there is one
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel('New request made');
    }

    // Create a new cancel token
    cancelTokenSourceRef.current = axios.CancelToken.source();

    const diffInDate = txnTo.diff(txnFrom, 'month');
    if (diffInDate > 6) {
      handleCustomAlert('Date Range', 'Please select range of 6months or less', 'danger');
    } else if (diffInDate <= 6) {
      setLoader(true);
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API}/department/list_of_dept_txns?page=${page + 1}`,
          {
            from: txnFrom,
            to: txnTo,
          },
          { withCredentials: true, cancelToken: cancelTokenSourceRef.current.token }
        );
        setTransactions(res.data.transactions);
        setFilteredTransaction(res.data.transactions);
        setTotalTransactions(res.data.totalDeptTransactions);
        console.log(transactions);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled');
        } else if (error.response.status === 401) {
          navigate('/login', { replace: true });
        } else console.log(error);
      } finally {
        setLoader(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title> Department Transaction Page | Naivedyam Dinning System </title>
      </Helmet>
      <Container>
        <Typography margin={'1rem'} marginLeft={'0.5rem'} variant="h2" gutterBottom>
          All Departments Transactions
        </Typography>
        <Typography margin={'1rem'} variant="h5" gutterBottom>
          [Latest Transactions]
        </Typography>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
            <div style={{ display: 'flex', alignItems: 'center', margin: '0 2rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <DatePicker
                  label={'From'}
                  openTo="day"
                  value={txnFrom}
                  onChange={(txnFrom) => setTxnFrom(txnFrom)}
                  views={['day', 'month', 'year']}
                  sx={{ maxWidth: '155px' }}
                />
                <DatePicker
                  label={'To'}
                  openTo="day"
                  value={txnTo}
                  onChange={(txnTo) => setTxnTo(txnTo)}
                  views={['day', 'month', 'year']}
                  sx={{ maxWidth: '155px' }}
                />
                <Button onClick={handleUpdate} variant="contained" sx={{ margin: 'auto 0px', maxHeight: '40px' }}>
                  Update
                </Button>
              </div>
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ref No.</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>Date&Time</TableCell>
                  <TableCell>Meal Items</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Update Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransaction.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.transaction_ref_no}</TableCell>
                    <TableCell>{transaction.timestamp}</TableCell>
                    <TableCell>{transaction.departmentDetails.name}</TableCell>
                    <TableCell>
                      {dayjs.utc(transaction.date_and_time).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      {transaction.meal_items.map((item, index) => (
                        <span key={index}>
                          {item.name} ({item.quantity}){index !== transaction.meal_items.length - 1 && ', '}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell>{transaction.status}</TableCell>
                    <TableCell>
                      <Select
                        value={transaction.status}
                        onChange={(event) => handleStatusChange(event, transaction._id)}
                      >
                        <MenuItem value="Request">Request</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={totalTransactions}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Card>
      </Container>
    </>
  );
}
