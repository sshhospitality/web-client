import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Container, Stack, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { ProductSort, ProductCard } from '../../sections/@dashboard/products';

function getCurrentDay() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();
  return daysOfWeek[currentDayIndex];
}
export default function ProductsPage() {
  const [day, setday] = useState(getCurrentDay());
  const [menu, setMenu] = useState([]);
  const [todaymenu, updtmenu] = useState([]);

  async function menuList() {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/menu/list',
        {
          xhrFeilds: {
            withCredentials: true,
          },
        },
        { withCredentials: true }
      );
      setMenu(data);
      console.log(data)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    menuList();
  }, []);

  useEffect(() => {
    menu.forEach((d) => {
      if (d.name === day) {
        updtmenu(d.meals);
      }
    });
  }, [menu, day]);

  return (
    <>
      <Helmet>
        <title>Menu Page | IIT Bhilai Dinning System</title>
      </Helmet>

      <Container>
        <Typography variant="h1" sx={{ mb: 0 }}>
          Menu
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductSort setDay={setday} />
          </Stack>
        </Stack>

        <Typography variant="h2" style={{ color: '#2b2c30' }}>
          {day}
        </Typography>

        {todaymenu.map((item, itemIndex) => (
          <>
            <Accordion
              key={itemIndex}
              style={{
                backgroundColor: 'white',
                marginTop: '20px',
                padding: '0px 10px',
                color: '#313131',
                borderRadius: '10px',
              }}
              TransitionProps={{ unmountOnExit: false }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography variant="h4">{item.type}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                  {/* <br/> */}

                  {item.items.map((i, index) => (
                    <ProductCard
                      key={index}
                      name={i.name}
                      category={i.category}
                    />
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          </>
        ))}
      </Container>
    </>
  );
}
