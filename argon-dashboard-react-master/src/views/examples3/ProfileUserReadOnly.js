import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Avatar, Grid, CircularProgress, IconButton } from '@mui/material'; // Import MUI components
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import de l'icône de retour

const ProfileUserReadOnly = () => {
  const { userId } = useParams(); // Récupère l'ID du client depuis l'URL
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Utilisé pour la redirection vers BookingP

  useEffect(() => {
    // Récupérer les informations utilisateur du client
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:9001/user/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations du client:', error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Fonction pour gérer le clic sur l'icône de retour
  const handleBackClick = () => {
    navigate('/bookingp'); // Redirection vers l'interface BookingP
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="h6" color="error">
          Aucun utilisateur trouvé.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #00c6ff, #0072ff)', // Dégradé visible
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      {/* Bouton de retour */}
      <IconButton
        sx={{ marginBottom: '20px', color: '#fff' }} // Style pour l'icône
        onClick={handleBackClick}
      >
        <ArrowBackIcon />
      </IconButton>

      <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              {/* Avatar */}
              <Grid item xs={12} sm={4} textAlign="center">
                <Avatar
                  src={`http://localhost:9001/images/users/${userData.avatar}`}
                  alt={userData.userName}
                  sx={{ width: 150, height: 150, margin: '0 auto', border: '2px solid #007bff' }}
                />
              </Grid>
              {/* User Info */}
              <Grid item xs={12} sm={8}>
                <Typography variant="h4" component="div" gutterBottom>
                  {userData.userName}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Email : {userData.email}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Téléphone : {userData.phoneNumber}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Section pour d'autres informations */}
        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Autres informations
              </Typography>
              {/* Ajouter d'autres informations spécifiques à l'utilisateur ici */}
              <Typography variant="body1" color="textSecondary">
                Rôle : {userData.role}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Date de création : {new Date(userData.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileUserReadOnly;
