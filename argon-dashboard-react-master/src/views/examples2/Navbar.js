import PropTypes from 'prop-types';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Import MUI components
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const Navbar = ({ hideUserInfo }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // State for search inputs
  const [searchCriteria, setSearchCriteria] = useState({
    location: '',
    serviceType: '',
    availability: '',
  });
  const [availabilityMenuOpen, setAvailabilityMenuOpen] = useState(false);

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

  // Handle input change for location and service type
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };

  // Handle availability selection
  const handleAvailabilitySelect = (value) => {
    setSearchCriteria({ ...searchCriteria, availability: value });
    setAvailabilityMenuOpen(false);
  };

  // Handle search submission
  const handleSearch = async () => {
    try {
      const { serviceType, location, availability } = searchCriteria;
      let response;
  
      if (serviceType) {
        response = await axios.post('http://localhost:9001/service/search/service', {
          serviceType,
        });
      } else if (location) {
        response = await axios.get('http://localhost:9001/service/search/location', {
          params: { location },
        });
      } else if (availability) {
        response = await axios.get('http://localhost:9001/service/search/availability', {
          params: { availability },
        });
      }
  
      // Redirection avec les résultats de la recherche
      navigate('/searchresults', { state: { services: response.data.services } });
    } catch (error) {
      console.error('Error during search:', error);
    }
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
              <NavLink to="/home" className="nav-item nav-link" activeClassName="active">Home</NavLink>
              <NavLink to="/about" className="nav-item nav-link" activeClassName="active">About</NavLink>
              <NavLink to="/service" className="nav-item nav-link" activeClassName="active">Services</NavLink>
              
              {user?.role === 'USER' && (
                <NavLink to="/booking" className="nav-item nav-link" activeClassName="active">Booking</NavLink>
              )}

              {user?.role === 'ADMIN' && (
                <NavLink to="/admin" className="nav-item nav-link" activeClassName="active">Admin Dashboard</NavLink>
              )}

              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                <div className="dropdown-menu fade-up m-0">
                  <NavLink to="/Category" className="dropdown-item">Categories</NavLink>
                  <NavLink to="/team" className="dropdown-item">Technicians</NavLink>
                  <NavLink to="/testimonial" className="dropdown-item">Testimonial</NavLink>
                  <NavLink to="/404" className="dropdown-item">404 Page</NavLink>
                </div>
              </div>
              <NavLink to="/contact" className="nav-item nav-link" activeClassName="active">Contact</NavLink>
            </div>

            {/* Barre de recherche moderne intégrée dans la navbar */}
            <div className="search-bar d-flex align-items-center">
              <TextField
                variant="outlined"
                placeholder="Location"
                size="small"
                name="location"
                value={searchCriteria.location}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon style={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                  style: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' },
                }}
                className="me-2"
              />
              <TextField
                variant="outlined"
                placeholder="Service Type"
                size="small"
                name="serviceType"
                value={searchCriteria.serviceType}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BuildIcon style={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                  style: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' },
                }}
                className="me-2"
              />

              {/* Disponibilité avec un menu déroulant au survol */}
              <div
                className="availability-selector position-relative"
                onMouseEnter={() => setAvailabilityMenuOpen(true)}
                onMouseLeave={() => setAvailabilityMenuOpen(false)}
              >
                <TextField
                  variant="outlined"
                  placeholder="Availability"
                  size="small"
                  value={searchCriteria.availability}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon style={{ color: 'white' }} />
                      </InputAdornment>
                    ),
                    style: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' },
                  }}
                  className="me-2"
                />

                {/* Menu déroulant */}
                {availabilityMenuOpen && (
                  <div className="dropdown-menu show position-absolute" style={{ top: '100%', left: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', borderRadius: '8px' }}>
                    <a className="dropdown-item text-white" href="#" onClick={() => handleAvailabilitySelect('true')}>Available</a>
                    <a className="dropdown-item text-white" href="#" onClick={() => handleAvailabilitySelect('false')}>Not Available</a>
                  </div>
                )}
              </div>

              <button className="btn btn-primary" onClick={handleSearch}>
                <SearchIcon />
              </button>
            </div>

            {user?.role === 'USER' && !hideUserInfo && (
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
                  <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
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
