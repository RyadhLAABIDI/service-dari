import UserM from '../models/UserModel.js'; 


const updateAccount = async (req, res) => {
  try {
    const { userName, email, phoneNumber, password } = req.body;
    const avatar = req.file?.filename;

    const newUser = {
      userName,
      email,
      phoneNumber,
      avatar,
    };

    if (password) {
      newUser.password = password;
    }

    const updatedUser = await UserM.findByIdAndUpdate(req.payload._id, newUser, { new: true });

    res.status(200).json({
      message: "Account updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ message: error.message });
  }
};


const deleteAccount = async (req, res) => {
  try {
    console.log("Tentative de suppression de l'utilisateur avec ID:", req.payload._id);
    
    // Supprime l'utilisateur de la base de données
    const user = await UserM.findByIdAndDelete(req.payload._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({ message: error.message });
  }
};
const getUser = async (req, res) => {
  try {
    console.log('getUser called'); // Log d'appel de la fonction
    console.log('User ID from payload:', req.payload._id); // Log de l'ID utilisateur extrait du payload

    // Récupérer l'utilisateur par ID
    const user = await UserM.findById(req.payload._id);
    if (!user) {
      console.log('User not found'); // Log si l'utilisateur n'est pas trouvé
      return res.status(404).json({ message: "User not found!" });
    }

    // Supprimer le mot de passe des informations renvoyées pour des raisons de sécurité
    user.password = undefined; // Optionnel : ne pas renvoyer le mot de passe

    console.log('User found:', user); // Log des informations de l'utilisateur trouvé
    res.status(200).json(user); // Renvoyer les informations de l'utilisateur
  } catch (error) {
    console.error('Error in getUser:', error); // Log d'erreur
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Ajout de logs pour le démarrage du processus et l'ID utilisateur
    console.log('getUserById called');
    console.log('User ID from params:', userId);

    // Récupérer l'utilisateur par ID
    const user = await UserM.findById(userId);

    if (!user) {
      // Log si l'utilisateur n'est pas trouvé
      console.log(`User with ID ${userId} not found`);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Log si l'utilisateur est trouvé
    console.log('User found:', user);

    // Optionnel : retirer le mot de passe avant de renvoyer les données
    user.password = undefined;

    // Log des informations envoyées au client
    console.log('Sending user data:', user);
    res.status(200).json(user);
  } catch (error) {
    // Log de l'erreur en cas de problème
    console.error('Error in getUserById:', error.message);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'utilisateur' });
  }
};

  

const getAllUsers = async (req, res) => {
  try {
    // Filtrer les utilisateurs avec les rôles 'USER' ou 'PROVIDER'
    const allUsers = await UserM.find(
      { etatDelete: false, role: { $in: ['USER', 'PROVIDER'] } }, // Filtrer par rôle
      { userName: 1, email: 1, phoneNumber: 1, role: 1, avatar: 1, banned: 1 }
    );
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



  const getAllAdmins = async (req, res) => {
    console.log(req.body.role);
    try {
      const allUsers = await UserM.find({role: "ADMIN",etatDelete:false});
      res.status(200).json(allUsers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const banUser = async (req, res) => {
    try {
      const userId = req.body.userId;
      console.log(`Attempting to ban user with ID: ${userId}`);
  
      const user = await UserM.findByIdAndUpdate(
        userId,
        { banned: true },
        { new: true } // Retourne l'utilisateur mis à jour
      );
      if (!user) {
        console.log(`User with ID: ${userId} not found.`);
        return res.status(404).json({ message: "User not found!" });
      }
  
      console.log(`User with ID: ${userId} banned successfully.`);
      res.status(200).json({ message: "User blocked successfully", user });
    } catch (error) {
      console.error(`Error banning user with ID: ${req.body.userId} - ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  };
  
  const unBanUser = async (req, res) => {
    try {
      const userId = req.body.userId;
      console.log(`Attempting to unban user with ID: ${userId}`);
  
      const user = await UserM.findByIdAndUpdate(
        userId,
        { banned: false },
        { new: true } // Retourne l'utilisateur mis à jour
      );
      if (!user) {
        console.log(`User with ID: ${userId} not found.`);
        return res.status(404).json({ message: "User not found!" });
      }
  
      console.log(`User with ID: ${userId} unbanned successfully.`);
      res.status(200).json({ message: "User activated successfully", user });
    } catch (error) {
      console.error(`Error unbanning user with ID: ${req.body.userId} - ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  };
  
  
  export default { updateAccount, deleteAccount, getUser, getUserById, getAllUsers,getAllAdmins ,banUser,unBanUser};
  