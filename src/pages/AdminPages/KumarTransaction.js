import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Helmet } from 'react-helmet-async';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Card,
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Tooltip,
} from '@mui/material';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import { LoadingContext } from '../../components/LoadingContext';
// functions
import { formatDate } from '../../utils/functions/date_format';
import { exportPDF } from '../../utils/functions/pdf_download';
import { filter } from '../../utils/functions/filter_data';
// components
import { handleCustomAlert } from '../../components/handleCustomAlert';
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
];

// ----------------------------------------------------------------------

export default function KumarTransaction() {
  const cancelTokenSourceRef = useRef();

  const [txn, setTxn] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const [txnTo, setTxnTo] = useState(dayjs());
  const [txnFrom, setTxnFrom] = useState(dayjs().subtract(1, 'week').add(1, 'day'));

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const { setIsLoading } = useContext(LoadingContext);
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
          'http://localhost:5000/api/txn/transactions',
          {
            mess: 'mess-kumar',
            limit: 2000,
          },
          {
            cancelToken: cancelTokenSourceRef.current.token,
            withCredentials: true,
          }
        );
        setTxn(res.data.data);
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
  }, [navigate]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const users = txn
    .sort((a, b) => (a.transaction_date < b.transaction_date ? -1 : 1))
    .map((num, index) => ({
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;
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

  const filteredUsers = filter(users, order, orderBy, filterName);
  if (order === 'desc' && orderBy === 'date') filteredUsers.reverse();
  const isNotFound = !filteredUsers.length && !!filterName;

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
          'http://localhost:5000/api/txn/transactions',
          {
            mess: 'mess-galav',
            from: txnFrom,
            to: txnTo,
          },
          { withCredentials: true, cancelToken: cancelTokenSourceRef.current.token }
        );
        setTxn(res.data.data);
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
  const handleDownload = async () => {
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
      setIsLoading(true);
      try {
        const res = await axios.post(
          'http://localhost:5000/api/txn/transactions',
          {
            mess: 'mess-galav',
            from: txnFrom,
            to: txnTo,
          },
          { withCredentials: true, cancelToken: cancelTokenSourceRef.current.token }
        );
        if (res.data.data.length > 0) {
          exportPDF(res.data.data);
        } else {
          handleCustomAlert('No Data', 'No data found', 'danger');
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled');
        } else if (error.response.status === 401) {
          navigate('/login', { replace: true });
        } else console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
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
        <Typography margin={'1rem'} marginLeft={'0.5rem'} variant="h2" gutterBottom>
          Kumar Mess
        </Typography>
        <Typography margin={'1rem'} variant="h5" gutterBottom>
          [Latest Transactions]
        </Typography>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <div style={{ display: 'flex', alignItems: 'center', margin: '0 2rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <LightTooltip title="Select dates to download" placement="top" arrow followCursor>
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
              onClick={handleDownload}
            >
              Request for Download
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
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
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
                        <TableCell align="left">{trnsMode}</TableCell>
                        <TableCell align="left">{trnsRem}</TableCell>
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
            rowsPerPageOptions={[20, 30]}
            component="div"
            count={isNotFound ? 0 : filteredUsers.length}
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
            justifyContent: 'center',
          }}
        >
          <div style={{ position: 'relative', display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
            <Button
              variant="outlined"
              disabled={txn.length === 0}
              color={'secondary'}
              startIcon={<SkipPreviousIcon />}
              onClick={handleTrackPrev}
            >
              Track Previous
            </Button>
            <Button
              variant="outlined"
              disabled={txn.length === 0}
              color={'secondary'}
              endIcon={<SkipNextIcon />}
              onClick={handleTrackNext}
            >
              Track Next
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
