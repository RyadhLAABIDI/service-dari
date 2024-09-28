// import React from 'react';
import PropTypes from 'prop-types'; // Importer PropTypes pour la validation des props
import Carousel from '../views/examples2/Carousel';
import About from '../views/examples2/About';
import Services from '../views/examples2/Services';
import Contact from '../views/examples2/Contact';
import Team from '../views/examples2/Team';
import Testimonial from '../views/examples2/Testimonial';
import Booking from '../views/examples2/Booking';
import Categories from '../views/examples2/Category';
//import SearchResults from 'views/examples2/SearchResults';
const UserLayout = ({ hideBooking }) => {
  return (
    <div>
      
      <Carousel />
      <About />
      <Categories />
      <Services />
      <Contact />
      <Team />
      <Testimonial />
      {!hideBooking && <Booking />} {/* N'affiche Booking que si hideBooking est false */}
    </div>
  );
};

// Ajouter la validation des props
UserLayout.propTypes = {
  hideBooking: PropTypes.bool.isRequired,
};

export default UserLayout;
