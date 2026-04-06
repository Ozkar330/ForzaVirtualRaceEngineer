# Forza Virtual Race Engineer

Real-time telemetry analysis tool for Forza Motorsport and Forza Horizon games. This application captures UDP data packets from the game, parses them, and provides a modern dashboard for race engineering analysis.

## Project Architecture

The project is structured as a multi-tier application:

- **Electron (Orchestrator):** Located in `/electron`. Manages the application lifecycle, handles AWS Cognito authentication, and orchestrates the Python backend and React frontend processes.
- **Backend (Telemetry Server):** Located in `/backend`. A Python Flask-SocketIO server that listens for UDP telemetry packets from Forza and broadcasts the parsed data to connected clients.
- **Frontend (Dashboard):** Located in `/frontend`. A React + TypeScript + Vite application that provides the user interface, including gauges, charts (Recharts), and lap telemetry data.

## Key Technologies

- **Electron:** Cross-platform desktop framework.
- **React 19 & TypeScript:** Frontend development.
- **Vite:** Frontend build tool.
- **Flask & Flask-SocketIO:** Python web server and real-time communication.
- **AWS SDK (Cognito):** User authentication.
- **Socket.io:** Real-time data streaming between backend and frontend.

## Building and Running

### Development Mode

The easiest way to run the entire stack in development is through Electron:

```bash
cd electron
npm install
npm run dev
```

This will automatically:
1. Start the Vite development server for the frontend.
2. Start the Python backend server (requires Python 3 and dependencies).
3. Open the Electron login/configuration window.

### Individual Components

If you need to run components separately:

**Backend:**
```bash
cd backend
# Create and activate venv if needed
pip install -r requirements.txt
python server.py --ip 127.0.0.1 --udp-port 1025 --dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend (optional, if using PyInstaller)
cd backend
# Run build scripts if available

# Build Electron app
cd electron
npm run build
```

## Development Conventions

- **IPC Communication:** Use Electron's `ipcMain` and `ipcRenderer` (via `preload.js`) for communication between the main process and UI windows.
- **Telemetry Data:** The backend parses "dash" format packets. See `backend/TelemetryParser.py` for the full list of available attributes.
- **State Management:** The frontend uses React hooks and Socket.io for real-time telemetry updates.
- **Styling:** Vanilla CSS is used for the frontend and Electron renderer components.

## Directory Structure Highlights

- `backend/GameHandler.py`: Manages the UDP socket listener.
- `backend/TelemetryParser.py`: Core logic for unpacking Forza binary data packets.
- `electron/main.js`: Electron entry point and IPC handler definitions.
- `electron/backend-manager.js`: Logic for spawning and managing sub-processes.
- `frontend/src/hooks/useTelemetry.ts`: Custom hook for connecting to the telemetry stream.
- `frontend/src/components/`: Reusable React components for gauges and charts.
