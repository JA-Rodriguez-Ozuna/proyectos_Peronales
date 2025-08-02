# 🔧 Fix de Secuencias SQLite - Plus Graphics

## Problema Resuelto ✅

**CRÍTICO:** Las secuencias de IDs en SQLite no se reiniciaban automáticamente cuando se eliminaban todos los registros de una tabla, causando que los nuevos registros comenzaran con IDs altos en lugar de 1.

### Antes del Fix:
```
clientes: secuencia=9, registros=0     ❌ (debería ser 1)
pedidos: secuencia=6, registros=0      ❌ (debería ser 1) 
ventas: secuencia=4, registros=0       ❌ (debería ser 1)
```

### Después del Fix:
```
clientes: secuencia=1, registros=1     ✅
pedidos: secuencia eliminada          ✅ (se reinicia en 1)
ventas: secuencia=1, registros=1       ✅
```

## Solución Implementada

### 1. Endpoints Flask Mejorados

#### `/api/sequences/status` (GET)
Obtiene el estado actual de todas las secuencias:
```json
{
  "secuencias": [
    {
      "tabla": "productos",
      "secuencia_actual": 13,
      "registros_actuales": 11,
      "id_maximo": 11,
      "necesita_reset": false
    }
  ],
  "tablas_vacias_con_secuencia": []
}
```

#### `/api/reset-sequences` (POST)
Reseteo masivo con opciones:
```json
// Resetear solo tablas vacías
POST /api/reset-sequences
{}

// Resetear tablas específicas
POST /api/reset-sequences
{
  "tables": ["clientes", "ventas"]
}

// Forzar reseteo (PELIGROSO - incluye tablas con datos)
POST /api/reset-sequences
{
  "force": true
}
```

#### `/api/reset-sequences/<tabla>` (POST)
Reseteo individual de una tabla:
```json
// Resetear solo si está vacía
POST /api/reset-sequences/clientes
{}

// Forzar reseteo aunque tenga datos
POST /api/reset-sequences/clientes
{
  "force": true
}
```

### 2. Script Utilitario: `fix_sequences.py`

#### Análisis de Secuencias
```bash
python fix_sequences.py
```
Muestra estado actual y tablas problemáticas.

#### Corrección Automática
```bash
python fix_sequences.py --auto
```
Resetea automáticamente solo las tablas vacías con secuencias altas.

#### Modo Fuerza (PELIGROSO)
```bash
python fix_sequences.py --auto --force
```
Resetea TODAS las secuencias, incluso tablas con datos.

## Validaciones Implementadas

### ✅ Seguridad
- Por defecto solo resetea tablas vacías
- Requiere `force=true` para tablas con datos
- Validación de nombres de tabla
- Manejo de errores con rollback

### ✅ Información Detallada
- Estado actual vs. secuencia
- Conteo de registros
- IDs máximos reales
- Logs detallados del proceso

### ✅ Flexibilidad
- Reseteo masivo o individual
- Modo automático para scripts
- Modo fuerza para casos especiales

## Uso Recomendado

### En Desarrollo
```bash
# Verificar estado
python fix_sequences.py

# Corregir automáticamente
python fix_sequences.py --auto
```

### En Producción
```bash
# Solo verificar, NO corregir
python fix_sequences.py

# Revisar cuidadosamente antes de ejecutar
python fix_sequences.py --auto
```

### Desde el Frontend
```javascript
// Verificar estado
const response = await fetch('/api/sequences/status');
const status = await response.json();

// Resetear tabla específica
await fetch('/api/reset-sequences/clientes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ force: false })
});
```

## Tablas Afectadas

- **productos** ✅ - Mantiene secuencia (tiene datos)
- **clientes** ✅ - Secuencia reseteada
- **pedidos** ✅ - Secuencia reseteada  
- **pedido_productos** ✅ - Secuencia reseteada
- **ventas** ✅ - Secuencia reseteada
- **usuarios** ✅ - Mantiene secuencia (tiene datos)

## Resultado Final

✅ **PROBLEMA CRÍTICO RESUELTO**
- Nuevos registros comienzan con ID = 1
- Secuencias se mantienen correctamente
- No afecta datos existentes
- Herramientas para monitoreo y corrección

## ⚠️ Advertencias

1. **`--force` es PELIGROSO**: Resetea secuencias incluso con datos
2. **Backup recomendado**: Antes de usar force en producción
3. **Verificar manualmente**: El estado antes de aplicar correcciones masivas

---
*Fix implementado: 2025-08-02*
*Estado: RESUELTO ✅*