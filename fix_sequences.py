#!/usr/bin/env python3
"""
Script para corregir las secuencias SQLite que no se reinician automáticamente.
Este script identifica tablas vacías con secuencias altas y las resetea.
"""

import sqlite3
import sys

def get_sequence_status():
    """Obtiene el estado actual de todas las secuencias"""
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    try:
        # Obtener todas las secuencias
        sequences = cursor.execute('SELECT name, seq FROM sqlite_sequence ORDER BY name').fetchall()
        
        status = []
        for seq_name, seq_value in sequences:
            count = cursor.execute(f'SELECT COUNT(*) FROM {seq_name}').fetchone()[0]
            max_id = cursor.execute(f'SELECT MAX(id) FROM {seq_name}').fetchone()[0] or 0
            
            status.append({
                'tabla': seq_name,
                'secuencia_actual': seq_value,
                'registros_actuales': count,
                'id_maximo': max_id,
                'necesita_reset': count == 0 and seq_value > 0
            })
        
        return status
    finally:
        conn.close()

def reset_sequences(tables_to_reset, force=False):
    """Resetea las secuencias de las tablas especificadas"""
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    try:
        reset_count = 0
        for table in tables_to_reset:
            # Verificar nuevamente antes del reset
            count = cursor.execute(f'SELECT COUNT(*) FROM {table}').fetchone()[0]
            
            if count == 0 or force:
                cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{table}'")
                reset_count += 1
                print(f"OK Secuencia de '{table}' reseteada (tenía {count} registros)")
            else:
                print(f"WARNING '{table}' tiene {count} registros, no se resetea (usa --force para forzar)")
        
        if reset_count > 0:
            conn.commit()
            print(f"\nSUCCESS {reset_count} secuencias reseteadas correctamente")
        else:
            print("\nINFO No se resetearon secuencias")
            
    except Exception as e:
        print(f"ERROR: {e}")
        conn.rollback()
    finally:
        conn.close()

def main():
    print("ANALYZING SQLite sequences...")
    print("=" * 50)
    
    # Obtener estado actual
    status = get_sequence_status()
    
    # Mostrar estado actual
    print("Estado actual de secuencias:")
    for s in status:
        status_icon = "ERROR" if s['necesita_reset'] else "OK"
        print(f"{status_icon} {s['tabla']}: secuencia={s['secuencia_actual']}, registros={s['registros_actuales']}")
    
    # Identificar tablas que necesitan reset
    tables_needing_reset = [s['tabla'] for s in status if s['necesita_reset']]
    
    if not tables_needing_reset:
        print("\nOK Todas las secuencias están correctas")
        return
    
    print(f"\nWARNING Tablas que necesitan reset: {', '.join(tables_needing_reset)}")
    
    # Verificar argumentos de línea de comandos
    force = '--force' in sys.argv
    auto = '--auto' in sys.argv
    
    if auto:
        print("\nAUTO Modo automático activado, reseteando secuencias...")
        reset_sequences(tables_needing_reset, force)
    else:
        print("\nINFO Opciones:")
        print("  --auto   : Resetear automáticamente las tablas vacías")
        print("  --force  : Forzar reset incluso con datos (PELIGROSO)")
        print("\nEjemplos:")
        print("  python fix_sequences.py --auto")
        print("  python fix_sequences.py --auto --force")

if __name__ == '__main__':
    main()