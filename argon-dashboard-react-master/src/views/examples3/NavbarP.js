import PropTypes from 'prop-types';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useEffect } from 'react';
import axios from 'axios';

const Navbar = ({ hideUserInfo }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Fetch user data if necessary
  useEffect(() => {
    if (user && !user.userName) {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.get('http://localhost:9001/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <>
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

      <div className="container-fluid nav-bar" style={{ background: 'linear-gradient(45deg, #1a73e8, #000000)' }}>
        <nav className="navbar navbar-expand-lg navbar-light p-3 py-lg-0 px-lg-4">
          <Link to="/" className="navbar-brand d-flex align-items-center m-0 p-0 d-lg-none">
            <h1 className="text-primary m-0">Plumberz</h1>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="fa fa-bars"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav me-auto">
              <NavLink to="/homeprov" className="nav-item nav-link" activeClassName="active">Home</NavLink>
              <NavLink to="/aboutp" className="nav-item nav-link" activeClassName="active">About</NavLink>
              <NavLink to="/servicep" className="nav-item nav-link" activeClassName="active">Services</NavLink>
              
              {user?.role === 'PROVIDER' && (
                <NavLink to="/bookingp" className="nav-item nav-link" activeClassName="active">Booking</NavLink>
              )}

              {user?.role === 'ADMIN' && (
                <NavLink to="/admin" className="nav-item nav-link" activeClassName="active">Admin Dashboard</NavLink>
              )}

              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                <div className="dropdown-menu fade-up m-0">
                  <NavLink to="/CategoryP" className="dropdown-item">Categories</NavLink>
                  <NavLink to="/teamp" className="dropdown-item">Technicians</NavLink>
                  <NavLink to="/testimonialp" className="dropdown-item">Testimonial</NavLink>
                  <NavLink to="/404" className="dropdown-item">404 Page</NavLink>
                </div>
              </div>
              <NavLink to="/contactp" className="nav-item nav-link" activeClassName="active">Contact</NavLink>
            </div>

            {/* Partie de recherche exclue */}

            {user?.role === 'PROVIDER' && !hideUserInfo && (
              <div className="nav-item dropdown ms-3">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={user?.avatar ? `http://localhost:9001/images/users/${user.avatar}` : '/path/to/default-avatar.png'}
                    alt="User Avatar"
                    className="rounded-circle"
                    style={{ width: '30px', height: '30px', marginRight: '10px' }}
                  />
                  {user.userName}
                </a>
                <div className="dropdown-menu fade-up m-0">
                  <NavLink to="/profilep" className="dropdown-item">Profile</NavLink>
                  <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

Navbar.propTypes = {
  hideUserInfo: PropTypes.bool,
};

export default Navbar;
