#!/bin/bash

# =============================================================================
# Build Script para Forza Virtual Race Engineer
# =============================================================================
# Este script construye toda la aplicación:
# 1. Backend Python → Ejecutable con PyInstaller
# 2. Frontend React → Build de producción
# 3. Electron → App empaquetada
# =============================================================================

# Colores para output (hace más fácil leer los logs)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # Sin color

# Función para imprimir con colores
print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Función para imprimir sección
print_section() {
    echo ""
    print_color "$BLUE" "================================================"
    print_color "$MAGENTA" "$1"
    print_color "$BLUE" "================================================"
}

# =============================================================================
# INICIO DEL SCRIPT
# =============================================================================

print_section "🚀 Forza Virtual Race Engineer - Build Process"

# Detectar el sistema operativo
OS="unknown"
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
    PYTHON_CMD="python3"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    PYTHON_CMD="python3"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
    PYTHON_CMD="python"
else
    print_color "$RED" "❌ Sistema operativo no soportado: $OSTYPE"
    exit 1
fi

print_color "$YELLOW" "📊 Configuración detectada:"
print_color "$YELLOW" "   Sistema: $OS"
print_color "$YELLOW" "   Python: $PYTHON_CMD"
print_color "$YELLOW" "   Fecha: $(date)"

# =============================================================================
# PASO 1: LIMPIAR BUILDS ANTERIORES
# =============================================================================

print_section "🧹 Paso 1: Limpiando builds anteriores"

# Limpiar frontend
if [ -d "frontend/dist" ]; then
    rm -rf frontend/dist
    print_color "$GREEN" "  ✓ Limpiado: frontend/dist"
fi

# Limpiar Electron
if [ -d "electron/dist" ]; then
    rm -rf electron/dist
    print_color "$GREEN" "  ✓ Limpiado: electron/dist"
fi

# Limpiar backend (PyInstaller genera estos)
if [ -d "backend/dist" ]; then
    rm -rf backend/dist
    print_color "$GREEN" "  ✓ Limpiado: backend/dist"
fi

if [ -d "backend/build" ]; then
    rm -rf backend/build
    print_color "$GREEN" "  ✓ Limpiado: backend/build"
fi

# Limpiar archivo .spec de PyInstaller si existe
if [ -f "backend/server.spec" ]; then
    rm backend/server.spec
    print_color "$GREEN" "  ✓ Limpiado: backend/server.spec"
fi

# =============================================================================
# PASO 2: CONSTRUIR BACKEND PYTHON
# =============================================================================

print_section "🐍 Paso 2: Construyendo Backend Python"

cd backend || exit 1

# Verificar si existe un virtual environment
VENV_PYTHON=""
if [ -f "venv/bin/python" ]; then
    VENV_PYTHON="venv/bin/python"
    print_color "$GREEN" "  ✓ Virtual environment detectado"
elif [ -f "venv/Scripts/python.exe" ]; then
    # Windows
    VENV_PYTHON="venv/Scripts/python.exe"
    print_color "$GREEN" "  ✓ Virtual environment detectado (Windows)"
fi

# Usar venv si existe, sino usar Python del sistema
if [ -n "$VENV_PYTHON" ]; then
    PYTHON_TO_USE="$VENV_PYTHON"
    print_color "$BLUE" "  → Usando Python del venv: $PYTHON_TO_USE"
else
    PYTHON_TO_USE="$PYTHON_CMD"
    print_color "$YELLOW" "  ⚠ Usando Python del sistema: $PYTHON_TO_USE"
fi

# Verificar si PyInstaller está instalado
print_color "$BLUE" "  → Verificando PyInstaller..."
if ! $PYTHON_TO_USE -m pip list | grep -q pyinstaller; then
    print_color "$YELLOW" "  → PyInstaller no encontrado, instalando..."
    $PYTHON_TO_USE -m pip install pyinstaller
    
    if [ $? -ne 0 ]; then
        print_color "$RED" "  ❌ Error instalando PyInstaller"
        exit 1
    fi
    print_color "$GREEN" "  ✓ PyInstaller instalado"
else
    print_color "$GREEN" "  ✓ PyInstaller ya está instalado"
fi

# Crear el ejecutable con PyInstaller
print_color "$BLUE" "  → Creando ejecutable con PyInstaller..."
print_color "$BLUE" "  → Esto puede tomar 1-2 minutos..."

$PYTHON_TO_USE -m PyInstaller \
    --onefile \
    --name server \
    --clean \
    --noconfirm \
    --hidden-import engineio.async_drivers.threading \
    --log-level ERROR \
    server.py

if [ $? -ne 0 ]; then
    print_color "$RED" "  ❌ Error creando ejecutable con PyInstaller"
    exit 1
fi

# Verificar que el ejecutable se creó
EXECUTABLE_NAME="server"
if [[ "$OS" == "windows" ]]; then
    EXECUTABLE_NAME="server.exe"
fi

if [ ! -f "dist/$EXECUTABLE_NAME" ]; then
    print_color "$RED" "  ❌ Ejecutable no encontrado después del build"
    exit 1
fi

# En macOS/Linux, asegurar permisos de ejecución
if [[ "$OS" != "windows" ]]; then
    chmod +x "dist/$EXECUTABLE_NAME"
    print_color "$GREEN" "  ✓ Permisos de ejecución configurados"
fi

print_color "$GREEN" "  ✓ Backend construido exitosamente"
print_color "$BLUE" "  📍 Ejecutable en: backend/dist/$EXECUTABLE_NAME"

cd .. || exit 1

# =============================================================================
# PASO 3: CONSTRUIR FRONTEND REACT
# =============================================================================

print_section "⚛️  Paso 3: Construyendo Frontend React"

cd frontend || exit 1

# Verificar que npm está instalado
if ! command -v npm &> /dev/null; then
    print_color "$RED" "  ❌ npm no está instalado"
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    print_color "$YELLOW" "  → Instalando dependencias de npm..."
    npm install
    
    if [ $? -ne 0 ]; then
        print_color "$RED" "  ❌ Error instalando dependencias"
        exit 1
    fi
fi

# Construir el frontend
print_color "$BLUE" "  → Ejecutando build de React..."
npm run build

if [ $? -ne 0 ]; then
    print_color "$RED" "  ❌ Error construyendo frontend"
    exit 1
fi

print_color "$GREEN" "  ✓ Frontend construido exitosamente"
print_color "$BLUE" "  📍 Build en: frontend/dist/"

cd .. || exit 1

# =============================================================================
# PASO 4: EMPAQUETAR CON ELECTRON
# =============================================================================

print_section "📦 Paso 4: Empaquetando con Electron"

cd electron || exit 1

# Verificar dependencias de Electron
if [ ! -d "node_modules" ]; then
    print_color "$YELLOW" "  → Instalando dependencias de Electron..."
    npm install
    
    if [ $? -ne 0 ]; then
        print_color "$RED" "  ❌ Error instalando dependencias de Electron"
        exit 1
    fi
fi

# Construir según el sistema operativo
print_color "$BLUE" "  → Empaquetando para $OS..."

case $OS in
    mac)
        npm run dist-mac
        ELECTRON_OUTPUT="dist/mac-arm64"
        ;;
    linux)
        npm run dist-linux
        ELECTRON_OUTPUT="dist/linux-unpacked"
        ;;
    windows)
        npm run dist-win
        ELECTRON_OUTPUT="dist/win-unpacked"
        ;;
esac

if [ $? -ne 0 ]; then
    print_color "$RED" "  ❌ Error empaquetando con Electron"
    exit 1
fi

print_color "$GREEN" "  ✓ Aplicación empaquetada exitosamente"
print_color "$BLUE" "  📍 Aplicación en: electron/$ELECTRON_OUTPUT"

cd .. || exit 1

# =============================================================================
# RESUMEN FINAL
# =============================================================================

print_section "✅ Build Completado Exitosamente!"

print_color "$YELLOW" "📊 Resumen del Build:"
print_color "$YELLOW" "   ✓ Backend Python → Ejecutable creado"
print_color "$YELLOW" "   ✓ Frontend React → Build de producción listo"
print_color "$YELLOW" "   ✓ Electron → Aplicación empaquetada"

echo ""
print_color "$MAGENTA" "🎉 ¡La aplicación está lista para distribuir!"

# Instrucciones finales según el OS
echo ""
print_color "$BLUE" "📝 Próximos pasos:"
case $OS in
    mac)
        print_color "$BLUE" "   1. Encuentra la app en: electron/dist/mac-arm64/"
        print_color "$BLUE" "   2. Puedes arrastrar la .app a /Applications"
        print_color "$BLUE" "   3. En la primera ejecución, click derecho → Abrir"
        ;;
    windows)
        print_color "$BLUE" "   1. Encuentra la app en: electron/dist/win-unpacked/"
        print_color "$BLUE" "   2. Ejecuta el instalador .exe"
        ;;
    linux)
        print_color "$BLUE" "   1. Encuentra la app en: electron/dist/linux-unpacked/"
        print_color "$BLUE" "   2. Ejecuta el AppImage"
        ;;
esac

echo ""
print_color "$GREEN" "¡Build completado en $(date)!"