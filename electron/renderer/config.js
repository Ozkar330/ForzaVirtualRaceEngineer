document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveBtn');
    const startServerBtn = document.getElementById('startServerBtn');
    const openDashboardBtn = document.getElementById('openDashboardBtn');
    const ipInput = document.getElementById('ip');
    const portInput = document.getElementById('port');
    const welcomeText = document.getElementById('welcome-text');
    const statusMessage = document.getElementById('status-message');

    // Load user email from login
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        welcomeText.textContent = `Bienvenido, ${userEmail}!`;
    }

    // Check server status on load
    async function checkServerStatus() {
        try {
            const status = await window.electronAPI.serverStatus();
            if (status.bothRunning) {
                startServerBtn.textContent = 'Servidor Activo ✅';
                startServerBtn.classList.add('btn-active');
            }
        } catch (error) {
            console.error('Error checking server status:', error);
        }
    }

    // Check status when page loads
    checkServerStatus();

    function showStatus(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.className = isError ? 'error' : 'loading';
        statusMessage.classList.remove('hidden');
        
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 3000);
    }

    async function handleSave() {
        const ip = ipInput.value.trim();
        const port = portInput.value.trim();

        if (!ip || !port) {
            showStatus('Por favor ingresa IP y puerto', true);
            return;
        }

        try {
            const result = await window.electronAPI.saveConfig({ ip, port });
            
            if (result.success) {
                showStatus('Configuración guardada exitosamente');
            } else {
                showStatus('Error al guardar configuración', true);
            }
        } catch (error) {
            console.error('Save config error:', error);
            showStatus('Error al guardar configuración', true);
        }
    }

    async function handleOpenDashboard() {
        try {
            const result = await window.electronAPI.openDashboard();
            
            if (result.success) {
                showStatus('Abriendo dashboard...');
            } else {
                showStatus('Error al abrir dashboard', true);
            }
        } catch (error) {
            console.error('Open dashboard error:', error);
            showStatus('Error al abrir dashboard', true);
        }
    }

    async function handleStartServer() {
        const ip = ipInput.value.trim();
        const port = portInput.value.trim();

        if (!ip || !port) {
            showStatus('Por favor configura IP y puerto antes de iniciar', true);
            return;
        }

        showStatus('Iniciando servidor (backend + frontend)...');
        startServerBtn.disabled = true;
        
        try {
            const config = { ip, port };
            const result = await window.electronAPI.startServer(config);
            
            if (result.success) {
                showStatus(result.message);
                startServerBtn.textContent = 'Servidor Activo ✅';
                startServerBtn.classList.add('btn-active');
                
                // Auto-open dashboard after servers start
                setTimeout(async () => {
                    await handleOpenDashboard();
                }, 3000); // Más tiempo para que React se inicialice
            } else {
                showStatus('Error: ' + result.message, true);
                // Mostrar los logs para debugging
                console.error('Logs del backend:', result.logs);
                
                // También puedes mostrarlos en la UI
                const logsDiv = document.getElementById('logs');
                if (logsDiv) {
                    logsDiv.innerHTML = `<pre>${result.logs.join('\n')}</pre>`;
                }
            }
        } catch (error) {
            console.error('Start server error:', error);
            showStatus('Error al iniciar servidor', true);
        } finally {
            startServerBtn.disabled = false;
        }
    }

    // Event listeners
    saveBtn.addEventListener('click', handleSave);
    startServerBtn.addEventListener('click', handleStartServer);
    openDashboardBtn.addEventListener('click', handleOpenDashboard);
    
    // Allow Enter to save config
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    });
});