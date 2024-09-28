import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import { AuthProvider, useAuth } from "./AuthContext";

// Import des styles et des layouts
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'animate.css/animate.min.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import '../src/assets2/lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css';
import './assets2/css/style.css'; // Import des fichiers CSS personnalisés

// Import des fichiers JS nécessaires
import './assets2/lib/wow/wow.min.js';
import './assets2/lib/easing/easing.min.js';
import './assets2/lib/waypoints/waypoints.min.js';
import './assets2/lib/counterup/counterup.min.js';
import './assets2/lib/owlcarousel/owl.carousel.min.js';
import './assets2/lib/tempusdominus/js/moment.min.js';
import './assets2/lib/tempusdominus/js/moment-timezone.min.js';
import './assets2/js/main.js';

// Import des composants React
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Navbar from './views/examples2/Navbar';
import NavBarAccueil from './views/examples2/NavBarAccueil';
import Footer from './views/examples2/Footer';
import Services from './views/examples2/Services';
import About from './views/examples2/About';
import Team from './views/examples2/Team';
import Testimonial from './views/examples2/Testimonial';
import Booking from './views/examples2/Booking';
import Contact from './views/examples2/Contact';
import Categories from './views/examples2/Category';
import SearchResults from "views/examples2/SearchResults";
import Profile from 'views/examples2/ProfileUser';
import ProfileProviderReadOnly from "views/examples2/ProfileProviderReadOnly";
////  Import Pour le PROVIDER
import NavBarP from 'views/examples3/NavbarP'; // Chemin à adapter selon votre structure
import AboutP from "views/examples3/AboutP"; // Renommé en AboutP
import ProfileP from "views/examples3/ProfileP"; // Renommé en ProfileP
import ServicesP from "views/examples3/ServicesP"; // Renommé en ServicesP
import BookingP from "views/examples3/BookingP"; // Renommé en BookingP
import TestimonialP from "views/examples3/TestimonialP"; // Renommé en TestimonialP
import TeamP from "views/examples3/TeamP"; // Renommé en TeamP
import SearchResultsP from "views/examples3/SearchResultsP"; // Renommé en SearchResultsP
import CategoriesP from "views/examples3/CategoryP"; // Renommé en CategoriesP
import ContactP from "views/examples3/ContactP"; // Renommé en ContactP
import ProfileUserReadOnly from "views/examples3/ProfileUserReadOnly";
import ProfileProviderReadOnlyyy from "views/examples3/ProfileProviderReadOnlyyy";
import { Accueil, Signin, Signup } from './views/examples2/indexAccueil'; // Import des composants
import UserLayout from '../src/layouts/UserLayout'; // Import de UserLayout
import ProviderLayout from '../src/layouts/ProvLayout'; // Import de ProviderLayout

// PrivateRoute pour les routes protégées
const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Vous pouvez utiliser un spinner ici
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Vérification du rôle si défini
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string, // Utilisé pour vérifier le rôle si nécessaire
};

// Application principale
function App() {
  const location = useLocation();
  const { user } = useAuth();

  const isAccueilPage = location.pathname === '/accueil' || location.pathname === '/signin' || location.pathname === '/signup';
  const isAuthAdminPage = location.pathname.startsWith('/auth');
  const isAdminLayout = location.pathname.startsWith('/admin');
  const isUserLayout = location.pathname.startsWith('/user/layout');
  const isProviderLayout = location.pathname.startsWith('/provider/layout'); // Nouveau pour le Provider
  const isAdminUser = user?.role === 'admin';
  const isProviderUser = user?.role === 'PROVIDER'; // Vérifier si l'utilisateur est un Provider

  return (
    <div className="App">
      {/* Logique de navigation basée sur le type de page */}
      {!isAuthAdminPage && !isAdminLayout && (
        isAccueilPage ? <NavBarAccueil /> :
        isProviderUser ? <NavBarP hideUserInfo={isUserLayout && isAdminUser} /> : // Utiliser NavBarP pour les providers
        <Navbar hideUserInfo={isUserLayout && isAdminUser} />
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/accueil" />} />

        {/* Routes publiques */}
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Route pour Booking, visible uniquement pour les utilisateurs avec le rôle USER */}
        <Route
          path="/booking"
          element={
            <PrivateRoute role="USER">
              <Booking />
            </PrivateRoute>
          }
        />

        {/* Route pour Booking, visible uniquement pour les utilisateurs avec le rôle PROVIDER */}
        <Route
          path="/bookingP"
          element={
            <PrivateRoute role="PROVIDER">
              <BookingP />
            </PrivateRoute>
          }
        />
        <Route
          path="/provider/user/:userId/profile"
          element={
            <PrivateRoute role="PROVIDER">
              <ProfileUserReadOnly />
            </PrivateRoute>
          }
        />

          <Route
          path="/provider/provider/:providerId/profile"
          element={
            <PrivateRoute role="USER">
              <ProfileProviderReadOnly />
            </PrivateRoute>
          }
        />
        {/* zedt hedha */}
          <Route
          path="/provider/provider/:providerId/profilep"
          element={
            <PrivateRoute role="PROVIDER">
              <ProfileProviderReadOnlyyy />
            </PrivateRoute>
          }
        />


        {/* Route pour Home, accessible aux utilisateurs et admins */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <UserLayout hideBooking={isAdminUser} />
            </PrivateRoute>
          }
        />

        {/* Route pour le Provider */}
        <Route
          path="/homeprov"
          element={
            <PrivateRoute role="PROVIDER">
              <ProviderLayout hideBooking={isAdminUser} />
            </PrivateRoute>
          }
        />

        {/* Autres routes... */}
        <Route path="/about" element={<About />} />
        <Route path="/searchresults" element={<SearchResults />} />
        <Route path="/category" element={<Categories />} />
        <Route path="/service" element={<Services />} />
        <Route path="/team" element={<Team />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />

        {/* Routes pour les Providers */}
        <Route path="/aboutp" element={<AboutP />} />
        <Route path="/searchresultsp" element={<SearchResultsP />} />
        <Route path="/categoryp" element={<CategoriesP />} />
        <Route path="/servicep" element={<ServicesP />} />
        <Route path="/teamp" element={<TeamP />} />
        <Route path="/bookingp" element={<BookingP />} />
        <Route path="/testimonialp" element={<TestimonialP />} />
        <Route path="/contactp" element={<ContactP />} />
        <Route path="/profilep" element={<ProfileP />} />

        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        />
        <Route path="/auth/*" element={<AuthLayout />} />

        <Route
          path="/user/*"
          element={
            <PrivateRoute>
              <UserLayout hideBooking={isAdminUser} />
            </PrivateRoute>
          }
        />

        {/* Route pour le Provider */}
        <Route
          path="/provider/*"
          element={
            <PrivateRoute role="PROVIDER">
              <ProviderLayout hideBooking={isAdminUser} />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/accueil" />} />
      </Routes>
      {!isAuthAdminPage && !isAdminLayout && !isUserLayout && !isProviderLayout && !isAccueilPage && <Footer />}
    </div>
  );
}


// Création de la racine pour React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* AuthProvider enveloppe l'application */}
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

// Mesures de performance (facultatif)
import reportWebVitals from './reportWebVitals';
reportWebVitals();
