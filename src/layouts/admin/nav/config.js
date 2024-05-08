// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Student Details',
    path: '/admin/studentDetails',
    icon: icon('ic_lock'),
  },
  {
    title: 'Transaction Details',
    path: '/admin/transactionDetails',
    icon: icon('ic_user'),
  },
  {
    title: 'College Details',
    path: '/admin/collegeList',
    icon: icon('ic_lock'),
  },
/*   {
    title: 'Menu Details',
    path: '/admin/menuDetails',
    icon: icon('ic_cart'),
  }, */
/*   {
    title: 'Verification Portal',
    path: '/admin/verificationPortal',
    icon: icon('ic_blog'),
  }, */
  {
    title: 'College Registration',
    path: '/admin/CollegeRegister',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
