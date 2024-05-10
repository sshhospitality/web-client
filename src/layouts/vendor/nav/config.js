// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/vendor/dashboard/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Department List',
    path: '/vendor/departmentList',
    icon: icon('ic_people'),
  },
  {
    title: 'Department History',
    path: '/vendor/history',
    icon: icon('ic_user'),
  },
  {
    title: 'Register Department',
    path: '/vendor/departmentRegister',
    icon: icon('ic_register'),
  },
  {
    title: 'Student List',
    path: '/vendor/studentList',
    icon: icon('ic_people'),
  },
  {
    title: 'Student History',
    path: '/vendor/studentHistory',
    icon: icon('ic_user'),
  },
  {
    title: 'Register Student',
    path: '/vendor/studentRegister',
    icon: icon('ic_register'),
  },
  {
    title: 'Menu',
    path: '/vendor/menu',
    icon: icon('ic_cart'),
  },
  {
    title: 'Mess Details',
    path: '/vendor/messdetails',
    icon: icon('ic_cart'),
  },
  {
    title: 'Feedback',
    path: '/vendor/feedback',
    icon: icon('ic_feedback'),
  },
  {
    title: 'Profile',
    path: '/vendor/profile',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
