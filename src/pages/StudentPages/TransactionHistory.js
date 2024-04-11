import { Helmet } from 'react-helmet-async';
import { sentenceCase } from 'change-case';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import dayjs from 'dayjs';
// functions
import { filter } from '../../utils/functions/filter_data';
import { formatDate } from '../../utils/functions/date_format';
import { exportPDF } from '../../utils/functions/pdf_download';
// components
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
import SpinnerLoadingScreen from '../../components/SpinnerLoadingScreen';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'from', label: 'From', alignRight: false },
  { id: 'to', label: 'To', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'mode', label: 'Mode', alignRight: false },
  { id: 'rem', label: 'Remarks', alignRight: false },
];

// ----------------------------------------------------------------------

export default function TransactionHistory() {
  const cancelTokenSourceRef = useRef();
  const [txn, setTxn] = useState([]);
  const [loader, setLoader] = useState(true);
  const [txnTo, setTxnTo] = useState(dayjs());
  const [txnFrom, setTxnFrom] = useState(dayjs().subtract(1, 'month').add(1, 'day'));
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

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
        const res = await axios.post(
          'http://localhost:5000/api/txn/history',
          { from: txnFrom, to: txnTo },
          { withCredentials: true, cancelToken: cancelTokenSourceRef.current.token }
        );
        setTxn(res.data);
        console.log(res.data);
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
  }, [navigate, txnFrom, txnTo]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const users = txn.map((num, index) => ({
    id: index,
    accountFrom: num.account_from,
    accountTo: num.account_to,
    amount: num.amount,
    trnsType: num.transaction_type,
    trnsMode: num.transaction_mode,
    trnsDate: formatDate(num.transaction_date),
    trnsRem: num.remarks,
  }));
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
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
  const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 14,
      },
    })
  );
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredUsers = filter(users, order, orderBy, filterName);
  if (order === 'desc' && orderBy === 'date') filteredUsers.reverse();
  const isNotFound = !filteredUsers.length && !!filterName;

  const handleUpdate = async () => {
    const diffInDate = txnTo.diff(txnFrom, 'month');
    if (diffInDate > 6) {
      alert('Please select range of 6 months or less');
    } else if (diffInDate <= 6) {
      setLoader(true);
      try {
        const res = await axios.post(
          'http://localhost:5000/api/txn/history',
          {
            from: txnFrom,
            to: txnTo,
          },
          { withCredentials: true, cancelToken: cancelTokenSourceRef.current.token }
        );
        console.log(res.data);
        setTxn(res.data);
        localStorage.setItem('txn', res.data);
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
    <div>
      <Helmet>
        <title> History Page | IIT Bhilai Dinning System </title>
      </Helmet>

      <Container>
        <Typography component="h1" variant="h1" mb="40px" align="center">
          Transaction History
        </Typography>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <div style={{ display: 'flex', alignItems: 'center', margin: '0 2rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <LightTooltip title="Max range of 6 months is allowed" placement="top" arrow followCursor>
                  <InfoIcon style={{ margin: 'auto', color: '#4b4b4b' }} />
                </LightTooltip>
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
            <Button
              variant="outlined"
              style={{ margin: '15px 2rem', height: '2.5rem', minWidth: '140px' }}
              onClick={() => exportPDF(txn)}
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
                  rowCount={users.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
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

                        <TableCell align="left">{accountFrom}</TableCell>

                        <TableCell align="left">{accountTo}</TableCell>

                        <TableCell align="left">{amount}</TableCell>

                        <TableCell align="left">
                          <Label>{sentenceCase(trnsType)}</Label>
                        </TableCell>
                        <TableCell align="center">{trnsMode}</TableCell>
                        <TableCell align="center">{trnsRem}</TableCell>
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
              {loader && <SpinnerLoadingScreen />}
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
              )}
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={isNotFound ? 0 : filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </div>
  );
}
