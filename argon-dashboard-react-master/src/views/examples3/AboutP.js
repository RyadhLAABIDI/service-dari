

// Import des images nécessaires
import about1 from '../../assets2/img/about-1.jpg';
import about2 from '../../assets2/img/about-2.jpg';

const About = () => {
  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="text-secondary text-uppercase">About Us</h6>
            <h1 className="mb-4">We Are Trusted Plumbing Company Since 1990</h1>
            <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet</p>
            <p className="fw-medium text-primary"><i className="fa fa-check text-success me-3"></i>Residential & commercial plumbing</p>
            <p className="fw-medium text-primary"><i className="fa fa-check text-success me-3"></i>Quality services at affordable prices</p>
            <p className="fw-medium text-primary"><i className="fa fa-check text-success me-3"></i>Immediate 24/ 7 emergency services</p>
            <div className="bg-primary d-flex align-items-center p-4 mt-5">
              <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-white" style={{ width: '60px', height: '60px' }}>
                <i className="fa fa-phone-alt fa-2x text-primary"></i>
              </div>
              <div className="ms-3">
                <p className="fs-5 fw-medium mb-2 text-white">Emergency 24/7</p>
                <h3 className="m-0 text-secondary">+012 345 6789</h3>
              </div>
            </div>
          </div>
          <div className="col-lg-6 pt-4" style={{ minHeight: '500px' }}>
            <div className="position-relative h-100 wow fadeInUp" data-wow-delay="0.5s">
              <img className="position-absolute img-fluid w-100 h-100" src={about1} style={{ objectFit: 'cover', padding: '0 0 50px 100px' }} alt="About Us" />
              <img className="position-absolute start-0 bottom-0 img-fluid bg-white pt-2 pe-2 w-50 h-50" src={about2} style={{ objectFit: 'cover' }} alt="About Us" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
