import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
//import Tables from "views/examples/Tables.js";
//import Icons from "views/examples/Icons.js";

// Importation des nouvelles vues Admin
import Admins from "views/examples/Admins.js";
import Users from "views/examples/Users.js";
import CategoryAdmin from "views/examples/CategoryAdmin.js";
import SubCategory from "views/examples/SubCategory.js";
import ServiceAdmin from "views/examples/ServiceAdmin.js";
import BookingAdmin from "views/examples/BookingAdmin.js";



var routes = [
  // Routes Admin
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/admins",
    name: "Admins",
    icon: "ni ni-single-02 text-blue",
    component: <Admins />,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users",
    icon: "ni ni-single-02 text-green",
    component: <Users />,
    layout: "/admin",
  },
  {
    path: "/categories",
    name: "Categories",
    icon: "ni ni-bullet-list-67 text-orange",
    component: <CategoryAdmin />,
    layout: "/admin",
  },
  {
    path: "/subcategories",
    name: "Sub Categories",
    icon: "ni ni-bullet-list-67 text-red",
    component: <SubCategory />,
    layout: "/admin",
  },
  {
    path: "/services",
    name: "Services",
    icon: "ni ni-bullet-list-67 text-yellow",
    component: <ServiceAdmin />,
    layout: "/admin",
  },
  {
    path: "/bookings",
    name: "Bookings",
    icon: "ni ni-calendar-grid-58 text-purple",
    component: <BookingAdmin />,
    layout: "/admin",
  },
  
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  
  
  // Auth routes
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },

  
];

export default routes;
