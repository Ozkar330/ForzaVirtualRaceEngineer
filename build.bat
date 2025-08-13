@echo off
REM =============================================================================
REM Build Script para Forza Virtual Race Engineer (Windows)
REM =============================================================================

echo.
echo ================================================
echo 🚀 Forza Virtual Race Engineer - Build Process
echo ================================================
echo.

REM =============================================================================
REM PASO 1: LIMPIAR BUILDS ANTERIORES
REM =============================================================================

echo 🧹 Paso 1: Limpiando builds anteriores...
echo.

if exist frontend\dist (
    rmdir /s /q frontend\dist
    echo   ✓ Limpiado: frontend\dist
)

if exist electron\dist (
    rmdir /s /q electron\dist
    echo   ✓ Limpiado: electron\dist
)

if exist backend\dist (
    rmdir /s /q backend\dist
    echo   ✓ Limpiado: backend\dist
)

if exist backend\build (
    rmdir /s /q backend\build
    echo   ✓ Limpiado: backend\build
)

if exist backend\server.spec (
    del backend\server.spec
    echo   ✓ Limpiado: backend\server.spec
)

REM =============================================================================
REM PASO 2: CONSTRUIR BACKEND PYTHON
REM =============================================================================

echo.
echo 🐍 Paso 2: Construyendo Backend Python...
echo.

cd backend

REM Verificar si existe venv
if exist venv\Scripts\python.exe (
    set PYTHON_CMD=venv\Scripts\python.exe
    echo   ✓ Virtual environment detectado
) else (
    set PYTHON_CMD=python
    echo   ⚠ Usando Python del sistema
)

REM Instalar PyInstaller si no existe
echo   → Verificando PyInstaller...
%PYTHON_CMD% -m pip list | findstr pyinstaller >nul
if errorlevel 1 (
    echo   → Instalando PyInstaller...
    %PYTHON_CMD% -m pip install pyinstaller
)

REM Crear ejecutable
echo   → Creando ejecutable con PyInstaller...
echo   → Esto puede tomar 1-2 minutos...

%PYTHON_CMD% -m PyInstaller ^
    --onefile ^
    --name server ^
    --clean ^
    --noconfirm ^
    --hidden-import flask ^
    --hidden-import flask_socketio ^
    --hidden-import flask_cors ^
    --log-level ERROR ^
    server.py

if errorlevel 1 (
    echo   ❌ Error creando ejecutable
    exit /b 1
)

echo   ✓ Backend construido exitosamente
cd ..

REM =============================================================================
REM PASO 3: CONSTRUIR FRONTEND REACT
REM =============================================================================

echo.
echo ⚛️ Paso 3: Construyendo Frontend React...
echo.

cd frontend

if not exist node_modules (
    echo   → Instalando dependencias...
    call npm install
)

echo   → Ejecutando build de React...
call npm run build

if errorlevel 1 (
    echo   ❌ Error construyendo frontend
    exit /b 1
)

echo   ✓ Frontend construido exitosamente
cd ..

REM =============================================================================
REM PASO 4: EMPAQUETAR CON ELECTRON
REM =============================================================================

echo.
echo 📦 Paso 4: Empaquetando con Electron...
echo.

cd electron

if not exist node_modules (
    echo   → Instalando dependencias...
    call npm install
)

echo   → Empaquetando para Windows...
call npm run dist-win

if errorlevel 1 (
    echo   ❌ Error empaquetando con Electron
    exit /b 1
)

echo   ✓ Aplicación empaquetada exitosamente
cd ..

REM =============================================================================
REM FINAL
REM =============================================================================

echo.
echo ================================================
echo ✅ Build Completado Exitosamente!
echo ================================================
echo.
echo 🎉 La aplicación está lista en: electron\dist\
echo.
pause