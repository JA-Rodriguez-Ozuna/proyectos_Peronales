#!/bin/bash

echo "🚀 Iniciando Plus Graphics Full-Stack..."

# Iniciar backend Flask en background
echo "📡 Iniciando backend Flask..."
python app.py &
BACKEND_PID=$!

# Esperar que backend este listo
sleep 10

# Iniciar frontend Next.js
echo "🖥️ Iniciando frontend Next.js..."
cd fronted-vo && npm start &
FRONTEND_PID=$!

echo "✅ Sistema completo iniciado:"
echo "   Backend (Flask): Puerto 5000"  
echo "   Frontend (Next.js): Puerto 3000"
echo "   PID Backend: $BACKEND_PID"
echo "   PID Frontend: $FRONTEND_PID"

# Mantener script vivo
wait $FRONTEND_PID