import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import WOW from 'wowjs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const Profile = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    avatar: '',
  });

  const fileInputRef = useRef();
  const { logout, setUser: updateUserInContext } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialiser WOW.js pour les animations
    new WOW.WOW().init();

    // Récupérer les informations utilisateur
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:9001/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData({
          userName: response.data.userName,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          avatar: response.data.avatar,
          password: '',
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avatar: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:9001/user', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Profil mis à jour avec succès');

      // Mettre à jour l'utilisateur dans le contexte AuthContext
      updateUserInContext(response.data.user);

      // Optionnel: Si le serveur renvoie un nouveau token après la mise à jour du profil
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert('Erreur lors de la mise à jour du profil');
    }
  };

  const handleChooseImage = () => {
    fileInputRef.current.click();
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:9001/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        logout();
        navigate('/signin');
      } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
        alert('Erreur lors de la suppression du compte. Veuillez réessayer.');
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden' }}>
        <img 
          src={
            formData.avatar instanceof File
              ? URL.createObjectURL(formData.avatar)
              : `http://localhost:9001/images/users/${formData.avatar}`
          } 
          alt="Cover" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
      <div style={{ textAlign: 'center', marginTop: '-100px', marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', border: '5px solid white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', margin: '0 auto' }}>
          <img
            className="rounded-circle mt-5"
            width="180px"
            height="180px"
            src={
              formData.avatar instanceof File
                ? URL.createObjectURL(formData.avatar)
                : `http://localhost:9001/images/users/${formData.avatar}`
            }
            alt="Profil"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button onClick={handleChooseImage} style={{ marginTop: '10px', padding: '10px 25px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer', transition: 'background 0.3s', fontSize: '16px' }}>
            Choisir une image
          </button>
        </div>
        <h1 style={{ fontSize: '32px', margin: '10px 0' }}>{formData.userName.replace(/'/g, "&apos;")}</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>{formData.email}</p>
        <p style={{ fontSize: '18px', color: '#666' }}>{formData.phoneNumber}</p>
      </div>
      <form 
        style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }} 
        onSubmit={handleSubmit}
      >
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="userName" style={{ fontWeight: 'bold' }}>Nom d&apos;utilisateur</label>
          <input 
            type="text" 
            id="userName" 
            name="userName" 
            value={formData.userName} 
            onChange={handleInputChange} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ fontWeight: 'bold' }}>Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleInputChange} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="phoneNumber" style={{ fontWeight: 'bold' }}>Numéro de téléphone</label>
          <input 
            type="text" 
            id="phoneNumber" 
            name="phoneNumber" 
            value={formData.phoneNumber} 
            onChange={handleInputChange} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ fontWeight: 'bold' }}>Mot de passe</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password} 
            onChange={handleInputChange} 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} 
          />
        </div>
        <button 
          type="submit" 
          style={{ marginTop: '15px', width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}
        >
          Mettre à jour le profil
        </button>
        <button 
          type="button" 
          style={{ marginTop: '15px', width: '100%', padding: '10px', backgroundColor: '#dc3545', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}
          onClick={handleDelete}
        >
          Supprimer le compte
        </button>
      </form>
    </div>
  );
};

export default Profile;
