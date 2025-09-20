// Authentication System with Mock Data
class AuthSystem {
    constructor() {
        this.users = [
            {
                id: 1,
                email: 'admin@example.com',
                password: 'admin123',
                name: 'Administrator',
                role: 'admin'
            },
            {
                id: 2,
                email: 'user@example.com',
                password: 'user123',
                name: 'Utente Standard',
                role: 'user'
            },
            {
                id: 3,
                email: 'demo@example.com',
                password: 'demo123',
                name: 'Utente Demo',
                role: 'demo'
            }
        ];
    }

    async login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = this.users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    const { password: userPassword, ...userWithoutPassword } = user;
                    const authToken = `auth_token_${user.id}_${Date.now()}`;
                    
                    // Store in localStorage
                    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                    localStorage.setItem('authToken', authToken);
                    localStorage.setItem('loginTimestamp', new Date().toISOString());
                    
                    resolve({
                        success: true,
                        user: userWithoutPassword,
                        token: authToken,
                        message: `Benvenuto, ${user.name}!`
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Credenziali non valide. Riprova.'
                    });
                }
            }, 1500); // Simulate network delay
        });
    }

    async forgotPassword(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = this.users.find(u => u.email === email);
                
                if (user) {
                    resolve({
                        success: true,
                        message: 'Link per il reset della password inviato alla tua email'
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Email non trovata nel sistema'
                    });
                }
            }, 1000);
        });
    }

    async socialLogin(provider) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    id: 999,
                    email: `${provider}.user@example.com`,
                    name: `Utente ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
                    role: 'user',
                    provider: provider
                };
                
                const authToken = `${provider}_token_${Date.now()}`;
                
                // Store in localStorage
                localStorage.setItem('currentUser', JSON.stringify(mockUser));
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('loginTimestamp', new Date().toISOString());
                
                resolve({
                    success: true,
                    user: mockUser,
                    token: authToken,
                    message: `Login ${provider} completato con successo!`
                });
            }, 2000);
        });
    }

    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('loginTimestamp');
        
        return {
            success: true,
            message: 'Logout effettuato con successo'
        };
    }

    isAuthenticated() {
        const user = localStorage.getItem('currentUser');
        const token = localStorage.getItem('authToken');
        return !!(user && token);
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    getAuthToken() {
        return localStorage.getItem('authToken');
    }
}

// Create global auth instance
window.authSystem = new AuthSystem();