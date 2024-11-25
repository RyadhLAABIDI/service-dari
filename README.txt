Guide de Fonctionnement du Site
1. Pré-requis
Assurez-vous d'avoir Node.js installé sur votre machine.
Ayez un accès valide à une base de données MongoDB (modifiez le fichier .env avec vos informations).
Installez un gestionnaire de dépendances tel que npm.
2. Lancement du Backend
Ouvrez un terminal et naviguez vers le dossier du backend :
bash

cd backend-master
Installez les dépendances nécessaires :
npm install
Modifiez le fichier .env pour inclure le lien correct vers votre base de données MongoDB 

Lancez le serveur backend :


npm start
Le serveur backend sera maintenant actif, généralement à l'adresse http://localhost:9001.
3. Lancement du Frontend
Ouvrez un autre terminal et naviguez vers le dossier du frontend :

cd argon-dashboard-react-master
Installez les dépendances nécessaires :

npm install

Lancez le serveur frontend :

npm start
Le site sera disponible dans votre navigateur à l'adresse http://localhost:3000.
4. Utilisation du Site
Inscription et Connexion
Depuis l'interface d'accueil, deux options sont disponibles :
Inscription : Créez un compte en tant qu'utilisateur ou prestataire. Pendant l'inscription, sélectionnez votre rôle (User ou Provider). Vous devez également ajouter une image dans le formulaire.
Connexion : Si vous avez déjà un compte, connectez-vous avec vos identifiants.
Accès au Dashboard Admin
Pour accéder au tableau de bord administrateur, ajoutez /admin à l'URL de votre navigateur. Exemple :
http://localhost:3000/admin

Vous serez redirigé vers l'interface de connexion administrateur. Connectez-vous avec vos identifiants admin.
5. Structure des Dossiers
backend-master/ : Contient le code source du serveur backend.
argon-dashboard-react-master/ : Contient le code source du frontend.
6. Remarques Importantes
Avant de démarrer, vérifiez que les ports utilisés (par défaut : 9001 pour le backend et 3000 pour le frontend) ne sont pas occupés.
Si vous rencontrez des problèmes, consultez les fichiers journaux dans le terminal pour plus de détails.
