document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const loading = document.getElementById('loading');

    // Pre-fill with test credentials (remove in production)
    usernameInput.value = 'eangeles';
    passwordInput.value = '5BbwQm3VvxAj87X!';

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        loading.classList.add('hidden');
    }

    function showLoading() {
        loading.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        loginBtn.disabled = true;
    }

    function hideLoading() {
        loading.classList.add('hidden');
        loginBtn.disabled = false;
    }

    async function handleLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showError('Por favor ingresa usuario y contraseña');
            return;
        }

        showLoading();

        try {
            const result = await window.electronAPI.login({ username, password });
            
            if (result.success) {
                // Store user data for config window
                localStorage.setItem('userEmail', result.user.email);
                // Close current window and open config window
                window.location.href = 'config.html';
            } else {
                showError(result.error || 'Error de autenticación');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Error de conexión. Verifica tu conexión a internet.');
        } finally {
            hideLoading();
        }
    }

    // Event listeners
    loginBtn.addEventListener('click', handleLogin);
    
    // Allow Enter key to trigger login
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
});