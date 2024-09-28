import { Link, NavLink } from 'react-router-dom';

const NavBarAccueil = () => {
  return (
    <>
      {/* Topbar Start */}
      <div className="container-fluid d-none d-lg-block" style={{ backgroundColor: 'black' }}>
        <div className="row align-items-center top-bar">
          <div className="col-lg-3 col-md-12 text-center text-lg-start">
            <Link to="/" className="navbar-brand m-0 p-0">
              <h1 className="text-primary m-0">gKid</h1>
            </Link>
          </div>
          <div className="col-lg-9 col-md-12 text-end">
            <div className="h-100 d-inline-flex align-items-center me-4">
              <i className="fa fa-map-marker-alt text-primary me-2"></i>
              <p className="m-0 text-white">123 Street, New York, USA</p>
            </div>
            <div className="h-100 d-inline-flex align-items-center me-4">
              <i className="far fa-envelope-open text-primary me-2"></i>
              <p className="m-0 text-white">info@example.com</p>
            </div>
            <div className="h-100 d-inline-flex align-items-center">
              <a className="btn btn-sm-square bg-white text-primary me-1" href="#"><i className="fab fa-facebook-f"></i></a>
              <a className="btn btn-sm-square bg-white text-primary me-1" href="#"><i className="fab fa-twitter"></i></a>
              <a className="btn btn-sm-square bg-white text-primary me-1" href="#"><i className="fab fa-linkedin-in"></i></a>
              <a className="btn btn-sm-square bg-white text-primary me-0" href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>
      {/* Topbar End */}

      {/* Navbar Start */}
      <div className="container-fluid nav-bar" style={{ background: 'linear-gradient(45deg, #1a73e8, #000000)' }}>
        <nav className="navbar navbar-expand-lg navbar-light p-3 py-lg-0 px-lg-4">
          <Link to="/" className="navbar-brand d-flex align-items-center m-0 p-0 d-lg-none">
            <h1 className="text-primary m-0">gKid</h1>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="fa fa-bars"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav me-auto">
              <NavLink to="/accueil" className="nav-item nav-link" activeClassName="active">Accueil</NavLink>
              <NavLink to="/signin" className="nav-item nav-link" activeClassName="active">Sign In</NavLink>
              <NavLink to="/signup" className="nav-item nav-link" activeClassName="active">Sign Up</NavLink>
            </div>
          </div>
        </nav>
      </div>
      {/* Navbar End */}
    </>
  );
};

export default NavBarAccueil;
