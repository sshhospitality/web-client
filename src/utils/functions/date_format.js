export const formatDate = (trnsDate) => {
    const date = new Date(trnsDate);

    // Define options for formatting the date
    const options = {
      year: 'numeric',
      month: 'short', // Use 'short' for abbreviated month name
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // Use 12-hour format with AM/PM
    };

    // Format the date using the options
    return date.toLocaleString('en-US', options);
  }