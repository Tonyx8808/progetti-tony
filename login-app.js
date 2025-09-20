// Login Application Logic
class LoginApp {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    initializeElements() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.togglePasswordBtn = document.getElementById('togglePassword');
        this.eyeIcon = document.getElementById('eyeIcon');
        this.submitBtn = document.getElementById('submitBtn');
        this.btnText = document.getElementById('btnText');
        this.forgotPasswordBtn = document.getElementById('forgotPassword');
        this.googleLoginBtn = document.getElementById('googleLogin');
        this.githubLoginBtn = document.getElementById('githubLogin');
        this.signUpLink = document.getElementById('signUpLink');
        this.rememberCheckbox = document.getElementById('remember');

        this.isPasswordVisible = false;
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleLogin(e));

        // Password visibility toggle
        this.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());

        // Forgot password
        this.forgotPasswordBtn.addEventListener('click', () => this.handleForgotPassword());

        // Social logins
        this.googleLoginBtn.addEventListener('click', () => this.handleSocialLogin('google'));
        this.githubLoginBtn.addEventListener('click', () => this.handleSocialLogin('github'));

        // Sign up link
        this.signUpLink.addEventListener('click', () => this.handleSignUp());

        // Input focus effects
        [this.emailInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', () => this.onInputFocus(input));
            input.addEventListener('blur', () => this.onInputBlur(input));
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value.trim();

        if (!email || !password) {
            this.showNotification('Per favore compila tutti i campi', 'error');
            return;
        }

        this.setLoadingState(true);

        try {
            const result = await window.authSystem.login(email, password);
            this.showNotification(result.message, 'success');
            
            // Clear form
            this.form.reset();
            
            // Simulate redirect
            setTimeout(() => {
                this.showNotification('Reindirizzamento alla dashboard...', 'info');
            }, 2000);

        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.passwordInput.type = this.isPasswordVisible ? 'text' : 'password';
        
        this.eyeIcon.innerHTML = this.isPasswordVisible ?
            `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>` :
            `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>`;
    }

    async handleForgotPassword() {
        const email = this.emailInput.value.trim();
        
        if (!email) {
            this.showNotification('Inserisci prima la tua email', 'error');
            this.emailInput.focus();
            return;
        }

        try {
            const result = await window.authSystem.forgotPassword(email);
            this.showNotification(result.message, 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    async handleSocialLogin(provider) {
        const btn = provider === 'google' ? this.googleLoginBtn : this.githubLoginBtn;
        const originalContent = btn.innerHTML;
        
        // Set loading state
        btn.disabled = true;
        btn.innerHTML = `
            <div class="loading-spinner"></div>
            <span class="ml-2">Accesso in corso...</span>
        `;

        try {
            const result = await window.authSystem.socialLogin(provider);
            this.showNotification(result.message, 'success');
        } catch (error) {
            this.showNotification(`Errore durante l'accesso con ${provider}`, 'error');
        } finally {
            // Restore button
            btn.disabled = false;
            btn.innerHTML = originalContent;
        }
    }

    handleSignUp() {
        this.showNotification('La registrazione sarà disponibile presto', 'info');
    }

    onInputFocus(input) {
        input.parentElement.style.transform = 'scale(1.02)';
        input.parentElement.style.transition = 'transform 0.2s ease';
    }

    onInputBlur(input) {
        input.parentElement.style.transform = 'scale(1)';
    }

    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.style.opacity = '0.7';
            this.btnText.innerHTML = `
                <div class="loading-spinner"></div>
                <span class="ml-2">Accesso in corso...</span>
            `;
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.style.opacity = '1';
            this.btnText.innerHTML = 'Accedi';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    ${this.getNotificationIcon(type)}
                </svg>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide and remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>',
            error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>',
            info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
        };
        return icons[type] || icons.info;
    }

    checkAuthStatus() {
        if (window.authSystem.isAuthenticated()) {
            const user = window.authSystem.getCurrentUser();
            this.showNotification(`Già connesso come ${user.name}`, 'info');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginApp();
});