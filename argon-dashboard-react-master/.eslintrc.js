module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime' // Ajout de cette ligne pour React 17+
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    settings: {
        react: {
            version: 'detect' // Détection automatique de la version de React
        }
    },
    rules: {
        // Exemple de règles personnalisées
        'no-console': 'warn',
        'react/react-in-jsx-scope': 'off' // Désactiver la règle pour React 17+
    }
};
