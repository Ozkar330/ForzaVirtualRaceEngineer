# Forza Virtual Race Engineer - Electron Interface

Interfaz Electron que reemplaza la GUI de tkinter manteniendo la misma funcionalidad.

## Instalación

```bash
cd electron
npm install
```

## Uso

```bash
# Desarrollo
npm run dev

# Producción
npm start

# Empaquetar app
npm run build
```

## Troubleshooting App Empaquetada

Si la app empaquetada falla al iniciar servidores:

1. **Verificar Python**: La app necesita Python instalado en el sistema
   ```bash
   python --version  # o python3 --version
   ```

2. **Instalar dependencias Python**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Debugging**: Abre DevTools en la app empaquetada para ver logs
   - En desarrollo: automático con `--dev`
   - En producción: Ctrl+Shift+I (Windows/Linux) o Cmd+Option+I (Mac)

4. **Frontend en producción**: Por ahora solo funciona en modo desarrollo
   - Necesitarás tener el frontend corriendo por separado
   - O servir archivos estáticos desde Flask

## Funcionalidades

1. **Login**: Autenticación con AWS Cognito (mismas credenciales que tkinter)
2. **Configuración**: IP y puerto para telemetría de Forza
3. **Backend Manager**: Inicia/detiene el servidor Python automáticamente
4. **Dashboard**: Abre la interfaz React existente en localhost:5173

## Arquitectura

- `main.js`: Proceso principal de Electron
- `preload.js`: Exposición segura de APIs al renderer
- `cognito-handler.js`: Autenticación AWS Cognito
- `backend-manager.js`: Gestión del servidor Python
- `renderer/`: Interfaces HTML/CSS/JS para login y configuración

## Migración desde tkinter

Esta implementación replica exactamente la funcionalidad de:
- `backend/Login_GUI.py`
- `archive/Desktop_GUI/GUI.py`

Pero con una interfaz moderna usando tecnologías web.