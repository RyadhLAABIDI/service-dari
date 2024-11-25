import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext.js';  // Import the AuthContext
import axios from 'axios';
import WOW from 'wowjs'; // Assurez-vous d'avoir bien importé WOW
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';
import backgroundImg from '../../assets2/img/backgroundImg.jpg'; // Importer l'image de fond

const Signin = () => {
  const navigate = useNavigate(); // Utilisation de useNavigate au lieu de useHistory
  const { login, setUser } = useAuth();  // Use the login function from AuthContext
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const wow = new WOW.WOW(); // Correction de l'instanciation
    wow.init();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:9001/login', formData);
  
      if (response.data.status) {
        const { token, role, clientId, providerId } = response.data;
  
        // Stocker le token, le rôle, clientId et providerId dans le localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
  
        if (clientId) {
          localStorage.setItem('clientId', clientId);
        }
        
        if (providerId) {
          localStorage.setItem('providerId', providerId);
        }
  
        // Set the user as authenticated in the AuthContext
        login();
  
        // Fetch and set the user data in the AuthContext
        const userResponse = await axios.get('http://localhost:9001/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);
  
        // Redirect based on role
        if (role === 'PROVIDER') {
          navigate('/homeprov');
        } else if (role === 'USER') {
          navigate('/home');
        }
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      setError('An error occurred during sign in. Please try again.');
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
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Couleur blanche avec transparence
                borderRadius: '10px', // Coins arrondis pour un meilleur design
                backdropFilter: 'blur(10px)', // Effet de flou derrière l'élément
              }}
            >
              <h1 className="mb-4">Sign In</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
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
                    <button className="btn btn-primary w-100 py-3" type="submit">Sign In</button>
                  </div>
                </div>
              </form>
              <div className="mt-3">
                <p>Vous n&apos;avez pas de compte ? <Link to="/signup" className="text-primary">Inscrivez-vous ici</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
