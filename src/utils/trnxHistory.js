import axios from 'axios';

async function trnxList(id) {
    try {
    //   const mess = localStorage.getItem('mess');
    const res = await axios.post(`${process.env.REACT_APP_API}/api/txn/history`, { id }, {withCredentials: true});
      return res.data
      // console.log("response", response);
    //   const data = response.data;
    //   setMenu(data);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  export default trnxList;