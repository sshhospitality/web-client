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
dayjs.extend(utc);
dayjs.extend(timezone);

export default function VStuHistory() {
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
  const [filteredTransaction,setFilteredTransaction] = useState([]);
  const [filterName, setFilterName] = useState('');
  const { setIsLoading } = useContext(LoadingContext);
  useEffect(() => {
    async function fetchTransactions() {
      try {
        console.log(txnFrom);
        const res = await axios.post(
          `${process.env.REACT_APP_API}/txn/history?page=${page + 1}`,
          {
            from: txnFrom,
            to: txnTo,
          },
          { withCredentials: true }
        );
        setTransactions(res.data.transactions);
        setFilteredTransaction(res.data.transactions);
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
    setFilteredTransaction(transactions.filter((transaction) =>
      transaction.studentDetails.name.toLowerCase().includes(searchTerm)
    ));
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
          `${process.env.REACT_APP_API}/txn/history?page=${page + 1}`,
          {
            from: txnFrom,
            to: txnTo,
          },
          { withCredentials: true, cancelToken: cancelTokenSourceRef.current.token }
        );
        setTransactions(res.data.transactions);
        setFilteredTransaction(res.data.transactions);
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
        <title> Student Transaction Page | Naivedyam Dinning System </title>
      </Helmet>
      <Container>
        <Typography margin={'1rem'} marginLeft={'0.5rem'} variant="h2" gutterBottom>
          All Students Transactions
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
                  <TableCell>Transaction Mode</TableCell>
                  <TableCell>Meal Type</TableCell>
                  <TableCell>Meal Items</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransaction.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.transaction_ref_no}</TableCell>
                    <TableCell>{transaction.timestamp}</TableCell>
                    <TableCell>{transaction.studentDetails.name}</TableCell>
                    <TableCell>{transaction.transaction_mode}</TableCell>
                    <TableCell>{transaction.mealType}</TableCell>
                    <TableCell>{transaction.meal_items.join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={transactions.length} // Assuming total count is received from backend
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
