#!/bin/bash

echo "🔧 Iniciando build Plus Graphics..."

# Backend dependencies
echo "📦 Instalando dependencias backend..."
pip install -r requirements.txt

# Frontend dependencies y build
echo "📦 Instalando dependencias frontend..."
cd fronted-vo

echo "📍 Directorio actual: $(pwd)"
echo "📁 Archivos en directorio:"
ls -la

echo "🔧 Instalando npm packages..."
npm install

echo "🏗️ Building Next.js..."
npm run build

echo "✅ Build completado exitosamente"