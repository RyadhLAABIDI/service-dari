// import React from 'react';
import PropTypes from 'prop-types'; // Importer PropTypes pour la validation des props
import Carousel from '../views/examples3/CarouselP';
import About from '../views/examples3/AboutP';
import Services from '../views/examples3/ServicesP';
import Contact from '../views/examples3/ContactP';
import Team from '../views/examples3/TeamP';
import Testimonial from '../views/examples3/TestimonialP';
import Booking from '../views/examples3/BookingP';
import Categories from '../views/examples3/CategoryP';
const ProvLayout = ({ hideBooking }) => {
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
ProvLayout.propTypes = {
  hideBooking: PropTypes.bool.isRequired,
};

export default ProvLayout;
