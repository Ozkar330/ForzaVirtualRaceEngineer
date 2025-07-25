# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Forza Virtual Race Engineer is a real-time telemetry dashboard for Forza racing games. The system consists of a Python backend that receives UDP telemetry data from Forza games and broadcasts it via WebSocket, and a React frontend that displays the data in real-time racing dashboard components.

## Common Development Commands

### Frontend (React + TypeScript + Vite)
Location: `chatgpt/forza-dashboard/`

```bash
# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Backend (Python + Flask)
Location: `chatgpt/backend/`

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python server.py

# Set mock mode for testing (optional)
export MOCK_MODE=true
python server.py
```

## Architecture Overview

### Data Flow
1. **Forza Game** → UDP packets (port 1025) → **Python Backend**
2. **Python Backend** → WebSocket → **React Frontend**
3. **React Frontend** displays real-time telemetry dashboard

### Backend Architecture (`chatgpt/backend/`)

- **`server.py`**: Flask + SocketIO server that coordinates the system
- **`udp_listener.py`**: Listens for UDP telemetry packets from Forza on port 1025
- **`data_packet.py`**: Parses Forza telemetry data packets (supports sled, dash, fh4+ formats)
- **`mock_manual.py`**: Manual testing tool for generating mock telemetry data

**Key Configuration**:
- Server runs on `192.168.0.90:5000` (hardcoded IP, adjust as needed)
- UDP listener on port 1025
- WebSocket CORS enabled for all origins
- Mock mode available via `MOCK_MODE` environment variable

### Frontend Architecture (`chatgpt/forza-dashboard/src/`)

**Main Components**:
- **`App.tsx`**: Root component managing session state and telemetry connection
- **`hooks/useTelemetry.ts`**: WebSocket connection hook for real-time data
- **`components/Dashboard.tsx`**: Main dashboard container
- **Individual gauges**: `RPMAndSpeedGauge`, `GForceChartCircle`, `ThrottleBrakeMeter`, etc.
- **`SessionControlPanel.tsx`**: Start/stop/export session controls

**State Management**:
- Session state managed in `App.tsx` (start/stop/export functionality)
- Telemetry data flows from `useTelemetry` hook to dashboard components
- No external state management library (uses React hooks)

### Project Structure Variants

The repository contains multiple implementations:
- **`chatgpt/`**: Main active development (Flask backend + React frontend)
- **`original/`**: Legacy Python scripts for telemetry analysis
- **`cluade/`**: Alternative implementation variant
- **`Desktop_GUI/`**: Desktop GUI with AWS Cognito integration

## Network Configuration

The system is hardcoded to use IP `192.168.0.90`. To change this:

1. **Backend**: Update `ip` variable in `server.py` and `UDP_IP` in `udp_listener.py`
2. **Frontend**: Update socket connection URL in `hooks/useTelemetry.ts`

## Development Notes

### Forza Game Configuration
- Enable telemetry output in Forza game settings
- Set telemetry to send to the backend server IP on port 1025
- Supports Forza Motorsport 7, Forza Horizon 4+

### TypeScript Integration
- Frontend uses strict TypeScript configuration
- Telemetry data currently typed as `any` (improvement opportunity)
- Vite build system with hot module replacement

### WebSocket Connection
- Real-time bidirectional communication via Socket.IO
- Connection status displayed in header
- Automatic reconnection handled by Socket.IO client

### Testing & Mock Data
- Use `mock_manual.py` for manual testing without game connection
- Set `MOCK_MODE=true` environment variable to enable mock data generation
- No automated tests currently implemented