import { useEffect } from 'react';
import $ from 'jquery';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';

// Import direct des images
import carousel1 from '../../assets2/img/carousel-1.jpg';
import carousel2 from '../../assets2/img/carousel-2.jpg';

const Carousel = () => {
  useEffect(() => {
    $(document).ready(function () {
      $('.header-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 2000, // Temps entre les diapositives (2 secondes)
        autoplayHoverPause: true,
        items: 1,
      });
    });
  }, []);

  return (
    <div className="container-fluid p-0 mb-5">
      <div className="owl-carousel header-carousel position-relative">
        <div className="owl-carousel-item position-relative">
          <img className="img-fluid" src={carousel1} alt="Carousel 1" />
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: 'rgba(0, 0, 0, .4)' }}>
            <div className="container">
              <div className="row justify-content-start">
                <div className="col-12 col-lg-8">
                  <h5 className="text-white text-uppercase mb-3">Plumbing & Repairing Services</h5>
                  <h1 className="display-3 text-white mb-4">Efficient Residential Plumbing Services</h1>
                  <p className="fs-5 fw-medium text-white mb-4 pb-2">
                    Vero elitr justo clita lorem. Ipsum dolor at sed stet sit diam no. Kasd rebum ipsum et diam justo clita et kasd rebum sea elitr.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="owl-carousel-item position-relative">
          <img className="img-fluid" src={carousel2} alt="Carousel 2" />
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: 'rgba(0, 0, 0, .4)' }}>
            <div className="container">
              <div className="row justify-content-start">
                <div className="col-12 col-lg-8">
                  <h5 className="text-white text-uppercase mb-3">Plumbing & Repairing Services</h5>
                  <h1 className="display-3 text-white mb-4">Efficient Commercial Plumbing Services</h1>
                  <p className="fs-5 fw-medium text-white mb-4 pb-2">
                    Vero elitr justo clita lorem. Ipsum dolor at sed stet sit diam no. Kasd rebum ipsum et diam justo clita et kasd rebum sea elitr.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
