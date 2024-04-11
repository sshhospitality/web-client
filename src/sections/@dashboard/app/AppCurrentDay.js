import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Button, Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const StyledChartWrapper = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

AppCurrentDay.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartColors: PropTypes.arrayOf(PropTypes.string),
  dayWiseData: PropTypes.array,
};

export default function AppCurrentDay({ children, title, subheader, chartColors, dayWiseData, ...other }) {
  const theme = useTheme();
  const [isData, setIsData] = useState(false);
  console.log(dayWiseData);
  const chartLabels = dayWiseData.map((i) => i.label);

  const chartSeries = dayWiseData.map((i) => i.value);

  const chartOptions = useChart({
    colors: chartColors,
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  });
  useEffect(() => {
    if (dayWiseData.length === 0 || dayWiseData[0].label === 'No Data') {
      setIsData(false);
    } else {
      setIsData(true);
    }
  }, [dayWiseData]);
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      {children}
      {!isData && (
        <div>
          <Typography p={'24px'} width={'100%'} textAlign={'center'} variant="h5">
            No Data
          </Typography>
        </div>
      )}
      {isData && (
        <StyledChartWrapper dir="ltr">
          <ReactApexChart type="pie" series={chartSeries} options={chartOptions} height={280} />
        </StyledChartWrapper>
      )}
    </Card>
  );
}
