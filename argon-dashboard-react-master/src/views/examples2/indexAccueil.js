//import React from 'react';
import Accueil from './Accueil';
import NavBarAccueil from './NavBarAccueil';
import Signin from './Signin';
import Signup from './Signup';
import backgroundImage from '../../assets2/img/backgroundImg.jpg'; 
//import './backgroundStyles.css'; // Importer le fichier CSS

const Index = () => {
  return (
    <div className="background-container">
      {/* Afficher l'image de fond */}
      <img 
        className="background-image img-fluid" 
        src={backgroundImage} 
        alt="Background" 
      />
    </div>
  );
};

export { Accueil, Signin, Signup, NavBarAccueil };
export default Index;
