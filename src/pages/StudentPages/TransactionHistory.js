import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/txn/history?page=${page + 1}`,
          {
            xhrFeilds: {
              withCredentials: true,
            },
          },
          { withCredentials: true }
        );
        setTransactions(res.data.transactions);
        console.log(res.data);
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

  return (
    <>
      <Helmet>
        <title> Live Service Page | IIT Bhilai Dinning System </title>
      </Helmet>
      <TableContainer component={Paper}>
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
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction.transaction_ref_no}</TableCell>
                <TableCell>{transaction.timestamp}</TableCell>
                <TableCell>{transaction.account_from}</TableCell>
                <TableCell>{transaction.mealType}</TableCell>
                <TableCell>{transaction.transaction_mode}</TableCell>
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
    </>
  );
}
