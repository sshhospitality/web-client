import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader, Box } from '@mui/material';
import { useChart } from '../../../components/chart';

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    fill: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
};

export default function AppWebsiteVisits({ title, subheader, chartData, ...other }) {
  // Generate labels for the last six months in reverse order with year numbers
  console.log(chartData)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels = [];
  let year = currentYear;
  for (let i = 0; i < 6; i+=1) {
    const monthIndex = (currentMonth - i + 12) % 12;
    if(monthIndex===11 && i>0) year = currentYear-1;
    labels.push(`${months[monthIndex]} ${year}`); // Add month name with year to labels
  }
  console.log(currentYear);
  console.log(labels)
  const chartOptions = useChart({
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
    },
    plotOptions: {
      bar: {
        columnWidth: '50%', // Adjust columnWidth as needed
      },
    },
    fill: {
      type: chartData.map((item) => item.fill),
    },
    labels: labels.reverse(), // Reverse the labels array to display oldest month on the left
    xaxis: {
      categories: labels, // Use the reversed labels
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => (val === 0 ? 'NO DATA' : val),
    },
  });

  return (
    <Card {...other} sx={{ width: '100%' }}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="bar" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
