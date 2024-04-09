

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

// function applySortFilter(array, comparator, query) {
//     const stabilizedThis = array.map((el, index) => [el, index]);
//     stabilizedThis.sort((a, b) => {
//         const order = comparator(a[0], b[0]);
//         if (order !== 0) return order;
//         return a[1] - b[1];
//     });

//     if (query) {
//         query = query.toLowerCase(); // Convert query to lowercase for case-insensitive search

//         // Binary search implementation
//         let left = 0;
//         let right = stabilizedThis.length - 1;
//         const results = [];

//         while (left <= right) {
//             const mid = Math.floor((left + right) / 2);
//             const user = stabilizedThis[mid][0];

//             if (matchesQuery(user, query)) {
//                 results.push(user);
//             }

//             if (comparator(user, query) < 0) {
//                 left = mid + 1;
//             } else {
//                 right = mid - 1;
//             }
//         }

//         return results;
//     }

//     return stabilizedThis.map(([el]) => el);
// }

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
        .filter(([user]) => Object.values(user).some((value) => {
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
          }))
        .map(([user]) => user);
    }
  
    return stabilizedThis.map(([el]) => el);
  }

function matchesQuery(user, query) {
    return Object.values(user).some((value) => {
        if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
        }
        if (typeof value === 'number') {
            return value.toString().includes(query);
        }
        return false;
    });
}

export const filter = (users, order, orderBy, filterName) => applySortFilter(users, getComparator(order, orderBy), filterName);
