import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Import correct de jwt-decode

const API_URL = 'http://localhost:9001/';

// Sign-in function
export const signIn = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}admin/login`, { email, password });
        // Store the token and clientId in localStorage after a successful login
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('clientId', response.data.clientId);
        localStorage.setItem('providerId', response.data.providerId); 
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Sign-in failed');
    }
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return { isAuthenticated: false };

    // Decode the token and check its validity
    try {
        const payload = jwtDecode(token);
        return {
            isAuthenticated: payload.exp > Date.now() / 1000, // Vérifiez si le token a expiré
            role: payload.role,
            userId: payload.userId,
            clientId: payload._id // Ajout du clientId à l'authentification
        };
    } catch (e) {
        return { isAuthenticated: false };
    }
};

// Logout function
export const logout = (callback) => {
    localStorage.removeItem('token');
    localStorage.removeItem('clientId'); // Supprimer le clientId lors de la déconnexion
    localStorage.removeItem('providerId');
    if (callback) callback();
};
