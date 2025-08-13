const { spawn } = require('child_process');
const path = require('path');
const { app, dialog } = require('electron');
const fs = require('fs');
const isDev = !app.isPackaged;

class BackendManager {
    constructor() {
        this.backendProcess = null;
        this.frontendProcess = null;
        this.isBackendRunning = false;
        this.isFrontendRunning = false;
        this.logs = [];
    }

    // Método para agregar logs que podamos recuperar
    addLog(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}`;
        this.logs.push(logEntry);
        console.log(logEntry);
        
        // También escribir a un archivo de log
        const logPath = path.join(app.getPath('userData'), 'backend.log');
        fs.appendFileSync(logPath, logEntry + '\n');
    }

    async startServer(config = { ip: '192.168.0.86', port: '1025' }) {
        this.addLog('=== Iniciando proceso de arranque del servidor ===');
        
        if (this.isBackendRunning && this.isFrontendRunning) {
            this.addLog('Servidores ya están en ejecución');
            return { success: true, message: 'Servers already running' };
        }

        try {
            // Start Backend (Python Flask)
            if (!this.isBackendRunning) {
                this.addLog('Iniciando backend Python...');
                
                // Determinar la ruta del backend
                const backendPath = isDev 
                    ? path.join(__dirname, '..', 'backend')
                    : path.join(process.resourcesPath, 'backend');
                
                this.addLog(`Backend path: ${backendPath}`);
                
                // Verificar que el directorio existe
                if (!fs.existsSync(backendPath)) {
                    throw new Error(`Directorio backend no encontrado: ${backendPath}`);
                }
                
                let args;
                let pythonCmd;
                if (isDev) {
                    const venvPython = path.join(backendPath, 'venv', 'bin', 'python');
                    const pythonScript = path.join(backendPath, 'server.py');
                    this.addLog(`Python script: ${pythonScript}`);
                    
                    // Verificar que el script existe
                    if (!fs.existsSync(pythonScript)) {
                        throw new Error(`Script Python no encontrado: ${pythonScript}`);
                    }

                    try {
                        pythonCmd = process.platform === 'win32' ? 'python' : venvPython;
                    } catch (error) {
                        // Mostrar diálogo al usuario
                        dialog.showErrorBox(
                            'Python no encontrado',
                            'No se pudo encontrar Python en tu sistema.\n\n' +
                            'Por favor instala Python 3 desde python.org\n' +
                            'En macOS también puedes usar: brew install python3'
                        );
                        throw error;
                    }
                    
                    args = [
                        pythonScript,
                        '--ip', config.ip,
                        '--udp-port', config.port
                    ];
                    
                    this.addLog(`Comando a ejecutar: ${pythonCmd} ${args.join(' ')}`);
                } else {
                    // En producción, usar el ejecutable
                    const backendExecutable = path.join(backendPath, 'server');
                    this.addLog(`Python executable: ${backendExecutable}`);
                    // En macOS, el ejecutable no necesita extensión
                    if (process.platform === 'win32') {
                        backendExecutable += '.exe';
                    }
                    
                    // Verificar que el ejecutable existe
                    if (!fs.existsSync(backendExecutable)) {
                        throw new Error(`Ejecutable del backend no encontrado: ${backendExecutable}`);
                    }
                    
                    // Hacer el archivo ejecutable en macOS/Linux
                    if (process.platform !== 'win32') {
                        fs.chmodSync(backendExecutable, '755');
                    }
                    
                    pythonCmd = backendExecutable
                    args = ['--ip', config.ip, '--udp-port', config.port];
                }
                
                // Opciones de spawn mejoradas para macOS
                const spawnOptions = {
                    cwd: backendPath,
                    env: {
                        ...process.env,
                        PYTHONUNBUFFERED: '1',  // Para ver los prints inmediatamente
                        PATH: `/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${process.env.PATH}`
                    },
                    shell: true  // Importante en macOS empaquetado
                };
                
                this.backendProcess = spawn(pythonCmd, args, spawnOptions);

                // Capturar stdout
                this.backendProcess.stdout.on('data', (data) => {
                    const message = `Backend OUT: ${data.toString()}`;
                    this.addLog(message);
                    
                    // Detectar cuando el servidor está listo
                    if (data.toString().includes('Running on') || 
                        data.toString().includes('started')) {
                        this.addLog('✅ Backend iniciado correctamente');
                    }
                });

                // Capturar stderr
                this.backendProcess.stderr.on('data', (data) => {
                    const message = `Backend ERR: ${data.toString()}`;
                    this.addLog(message);
                    
                    // Detectar errores comunes
                    const errorStr = data.toString();
                    if (errorStr.includes('ModuleNotFoundError')) {
                        dialog.showErrorBox(
                            'Dependencias Python faltantes',
                            'Faltan módulos de Python. Ejecuta:\n' +
                            'pip install -r requirements.txt\n' +
                            'en la carpeta del backend.'
                        );
                    }
                });

                // Manejar cierre del proceso
                this.backendProcess.on('close', (code) => {
                    this.addLog(`Backend cerrado con código: ${code}`);
                    this.isBackendRunning = false;
                    this.backendProcess = null;
                });

                // Manejar errores de spawn
                this.backendProcess.on('error', (error) => {
                    this.addLog(`ERROR al iniciar backend: ${error.message}`);
                    this.addLog(`Stack trace: ${error.stack}`);
                    this.isBackendRunning = false;
                    this.backendProcess = null;
                    
                    dialog.showErrorBox(
                        'Error al iniciar backend',
                        `No se pudo iniciar el servidor Python:\n${error.message}`
                    );
                });

                this.isBackendRunning = true;
                this.addLog('Backend proceso iniciado, esperando confirmación...');
            }

            // Start Frontend (React Vite)
            if (!this.isFrontendRunning) {
                if (isDev) {
                    this.addLog('Modo desarrollo: Iniciando servidor Vite...');
                    const frontendPath = path.join(__dirname, '..', 'frontend');
                    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
                    
                    this.frontendProcess = spawn(npmCmd, ['run', 'dev'], {
                        cwd: frontendPath,
                        shell: true,
                        env: {
                            ...process.env,
                            PATH: `/usr/local/bin:/usr/bin:/bin:${process.env.PATH}`
                        }
                    });

                    this.frontendProcess.stdout.on('data', (data) => {
                        this.addLog(`Frontend OUT: ${data.toString()}`);
                    });

                    this.frontendProcess.stderr.on('data', (data) => {
                        this.addLog(`Frontend ERR: ${data.toString()}`);
                    });

                    this.frontendProcess.on('close', (code) => {
                        this.addLog(`Frontend cerrado con código: ${code}`);
                        this.isFrontendRunning = false;
                        this.frontendProcess = null;
                    });

                    this.isFrontendRunning = true;
                } else {
                    this.addLog('Modo producción: Frontend servido por Flask');
                    this.isFrontendRunning = true;
                }
            }
            
            // Esperar un poco más para que los servicios arranquen
            this.addLog('Esperando que los servicios se inicialicen...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const status = this.getStatus();
            const message = `Backend: ${status.backend.isRunning ? '✅' : '❌'} | Frontend: ${status.frontend.isRunning ? '✅' : '❌'}`;
            this.addLog(message);
            
            if (this.isBackendRunning && this.isFrontendRunning) {
                return { 
                    success: true, 
                    message: `Servidor iniciado correctamente\nIP: ${config.ip}, UDP: ${config.port}`,
                    logs: this.logs
                };
            } else {
                return { 
                    success: false, 
                    message: 'Error al iniciar uno o más servicios',
                    logs: this.logs
                };
            }

        } catch (error) {
            this.addLog(`ERROR CRÍTICO: ${error.message}`);
            return { 
                success: false, 
                message: error.message,
                logs: this.logs
            };
        }
    }

    stopServer() {
        this.addLog('Deteniendo servidores...');
        let stopped = [];
        
        if (this.backendProcess) {
            // En macOS, usar SIGTERM para un cierre limpio
            this.backendProcess.kill('SIGTERM');
            this.backendProcess = null;
            this.isBackendRunning = false;
            stopped.push('Backend');
        }
        
        if (this.frontendProcess) {
            this.frontendProcess.kill('SIGTERM');
            this.frontendProcess = null;
            this.isFrontendRunning = false;
            stopped.push('Frontend');
        }
        
        const message = stopped.length > 0 
            ? `${stopped.join(' y ')} detenido${stopped.length > 1 ? 's' : ''}`
            : 'Los servidores no estaban ejecutándose';
            
        this.addLog(message);
        
        return { 
            success: true, 
            message,
            logs: this.logs
        };
    }

    getStatus() {
        return {
            backend: {
                isRunning: this.isBackendRunning,
                pid: this.backendProcess ? this.backendProcess.pid : null
            },
            frontend: {
                isRunning: this.isFrontendRunning,
                pid: this.frontendProcess ? this.frontendProcess.pid : null
            },
            bothRunning: this.isBackendRunning && this.isFrontendRunning,
            logs: this.logs
        };
    }

    // Método para obtener los logs
    getLogs() {
        return this.logs;
    }

    // Método para obtener la ruta del archivo de log
    getLogPath() {
        return path.join(app.getPath('userData'), 'backend.log');
    }
}

module.exports = BackendManager;