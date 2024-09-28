import React from 'react';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'animate.css'; // Si vous utilisez animate.css pour les animations
import 'font-awesome/css/font-awesome.min.css';
import WOW from 'wowjs';
import $ from 'jquery';
import 'owl.carousel';

// Import direct des images
import testimonial1 from '../../assets2/img/testimonial-1.jpg';
import testimonial2 from '../../assets2/img/testimonial-2.jpg';
import testimonial3 from '../../assets2/img/testimonial-3.jpg';
import testimonial4 from '../../assets2/img/testimonial-4.jpg';

// Intégration du style CSS dans le même fichier
const styles = {
  testimonialItem: {
    position: 'relative',
    zIndex: 1,
  },
  testimonialText: {
    fontSize: '14px',
  },
  testimonialImage: {
    border: '1px solid #ddd',
  },
};

class Testimonial extends React.Component {
  componentDidMount() {
    new WOW.WOW().init();

    // Initialisation du carrousel Owl
    $('.testimonial-carousel').owlCarousel({
      autoplay: true,
      smartSpeed: 1000,
      margin: 25,
      loop: true,
      nav: false,
      dots: true,
      items: 3,  // Afficher 3 items à la fois
      responsive: {
        0: {
          items: 1,  // 1 item pour les écrans de petite taille
        },
        768: {
          items: 2,  // 2 items pour les écrans moyens
        },
        992: {
          items: 3,  // 3 items pour les écrans plus grands
        },
      },
    });
  }

  render() {
    const testimonials = [
      { id: 1, img: testimonial1 },
      { id: 2, img: testimonial2 },
      { id: 3, img: testimonial3 },
      { id: 4, img: testimonial4 },
    ];

    return (
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="text-center">
            <h6 className="text-secondary text-uppercase">Testimonial</h6>
            <h1 className="mb-5">Our Clients Say!</h1>
          </div>
          <div className="owl-carousel testimonial-carousel position-relative wow fadeInUp" data-wow-delay="0.1s">
            {testimonials.map((testimonial) => (
              <div className="testimonial-item text-center" key={testimonial.id} style={styles.testimonialItem}>
                <div className="testimonial-text bg-light text-center p-4 mb-4" style={styles.testimonialText}>
                  <p className="mb-0">
                    Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum
                    et lorem et sit.
                  </p>
                </div>
                <img
                  className="bg-light rounded-circle p-2 mx-auto mb-2"
                  src={testimonial.img}
                  alt={`Testimonial ${testimonial.id}`}
                  style={{ ...styles.testimonialImage, width: '80px', height: '80px' }}
                />
                <div className="mb-2">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <small key={i} className="fa fa-star text-secondary"></small>
                    ))}
                </div>
                <h5 className="mb-1">Client Name</h5>
                <p className="m-0">Profession</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Testimonial;
