import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import WOW from 'wowjs';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';
import backgroundImg from '../../assets2/img/backgroundImg.jpg';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    avatar: null,
    role: '', 
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const wow = new WOW.WOW();
    wow.init();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://localhost:9001/registration', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status) {
        setSuccess(response.data.message);
        setError('');

        // Stocker le clientId et le token dans le localStorage
        localStorage.setItem('clientId', response.data.clientId);
        localStorage.setItem('providerId', response.data.providerId);
        localStorage.setItem('token', response.data.token);

        // Rediriger vers la page Signin après succès
        setTimeout(() => {
          navigate('/signin');
        }, 2000);

        // Réinitialiser le formulaire après succès
        setFormData({
          userName: '',
          email: '',
          phoneNumber: '',
          password: '',
          avatar: null,
          role: '',
        });
      }
    } catch (error) {
      if (error.response && error.response.data.response) {
        setError(error.response.data.response);
      } else {
        setError('An error occurred during registration.');
      }
      setSuccess('');
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div
              className="text-center p-5 wow fadeInUp"
              data-wow-delay="0.1s"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h1 className="mb-4">Sign Up</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <input 
                      type="text" 
                      name="userName" 
                      className="form-control border-0" 
                      placeholder="Your Name" 
                      value={formData.userName} 
                      onChange={handleChange} 
                      style={{ height: '55px' }} 
                      required 
                    />
                  </div>
                  <div className="col-12">
                    <input 
                      type="email" 
                      name="email" 
                      className="form-control border-0" 
                      placeholder="Your Email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      style={{ height: '55px' }} 
                      required 
                    />
                  </div>
                  <div className="col-12">
                    <input 
                      type="text" 
                      name="phoneNumber" 
                      className="form-control border-0" 
                      placeholder="Your Phone Number" 
                      value={formData.phoneNumber} 
                      onChange={handleChange} 
                      style={{ height: '55px' }} 
                      required 
                    />
                  </div>
                  <div className="col-12">
                    <input 
                      type="password" 
                      name="password" 
                      className="form-control border-0" 
                      placeholder="Your Password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      style={{ height: '55px' }} 
                      required 
                    />
                  </div>
                  <div className="col-12">
                    <input 
                      type="file" 
                      name="avatar" 
                      className="form-control border-0" 
                      onChange={handleFileChange} 
                      style={{ height: '55px' }} 
                    />
                  </div>
                  <div className="col-12">
                    <select 
                      name="role" 
                      className="form-control border-0" 
                      value={formData.role} 
                      onChange={handleChange} 
                      style={{ height: '55px' }} 
                      required
                    >
                      <option value="" disabled>Select Role</option>
                      <option value="USER">User</option>
                      <option value="PROVIDER">Provider</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary w-100 py-3" type="submit">Sign Up</button>
                  </div>
                </div>
              </form>
              <div className="mt-3">
                <p>Already have an account? <Link to="/signin" className="text-primary">Sign in here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
