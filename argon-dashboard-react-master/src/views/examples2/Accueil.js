import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import WOW from 'wowjs'; // Import de WOW.js pour les animations
import 'wowjs/css/libs/animate.css'; // Assurez-vous d'inclure ce fichier CSS pour les animations
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';
import backgroundImg from '../../assets2/img/backgroundImg.jpg'; // Importer l'image de fond

const Accueil = () => {
  useEffect(() => {
    new WOW.WOW().init(); // Initialiser les animations lors du montage du composant
  }, []);

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        color: '#fff', // Texte en blanc pour contraster avec l'image de fond
        fontFamily: "'Roboto', sans-serif", // Utilisation de la police Roboto
      }}
    >
      <div className="container text-center wow fadeInUp" data-wow-delay="0.1s">
        <h1 className="mb-4 wow bounceIn" data-wow-delay="0.2s" style={{ fontSize: '3rem', fontWeight: 'bold' }}>
          Bienvenue sur notre Application de Services
        </h1>
        <p className="lead wow fadeInUp" data-wow-delay="0.3s" style={{ fontSize: '1.5rem' }}>
          Découvrez comment notre plateforme peut vous aider à trouver les meilleurs services pour le jardinage, la plomberie, l&apos;électricité, et bien plus encore.
        </p>
        <p className="wow fadeInUp" data-wow-delay="0.4s" style={{ fontSize: '1.2rem', marginTop: '20px' }}>
          Inscrivez-vous dès aujourd&apos;hui et commencez à explorer les services offerts par nos prestataires de confiance.
        </p>

        <div className="mt-5">
          <Link
            to="/signup"
            className="btn btn-transparent btn-lg wow fadeInLeft"
            data-wow-delay="0.5s"
            style={{
              marginRight: '20px',
              padding: '10px 20px',
              fontSize: '1.2rem',
              display: 'inline-block',
              color: '#fff',
              border: '2px solid #fff',
              position: 'relative',
              textDecoration: 'none',
              backgroundColor: 'transparent',
              transition: 'all 0.3s ease',
            }}
          >
            <span
              className="arrow"
              style={{
                display: 'inline-block',
                marginRight: '10px',
                animation: 'moveArrow 1s infinite',
              }}
            >
              &#10140;
            </span>
            Inscription
          </Link>
          <Link
            to="/signin"
            className="btn btn-transparent btn-lg wow fadeInRight"
            data-wow-delay="0.5s"
            style={{
              padding: '10px 20px',
              fontSize: '1.2rem',
              display: 'inline-block',
              color: '#fff',
              border: '2px solid #fff',
              position: 'relative',
              textDecoration: 'none',
              backgroundColor: 'transparent',
              transition: 'all 0.3s ease',
            }}
          >
            <span
              className="arrow"
              style={{
                display: 'inline-block',
                marginRight: '10px',
                animation: 'moveArrow 1s infinite',
              }}
            >
              &#10140;
            </span>
            Connexion
          </Link>
        </div>
      </div>

      <style>
        {`
          @keyframes moveArrow {
            0% { transform: translateX(0); }
            50% { transform: translateX(5px); }
            100% { transform: translateX(0); }
          }

          .btn:hover {
            background-color: black !important;
            color: #fff !important;
            border-color: black !important;
          }

          .arrow {
            display: inline-block;
            animation: moveArrow 1s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Accueil;
