#!/usr/bin/env python3
"""
Test script to verify the reset database functionality
"""
import sqlite3
import requests
import json

def check_database_state():
    """Check current database state"""
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    print("=== DATABASE STATE ===")
    
    # Check sequences
    print("\nSEQUENCES:")
    try:
        sequences = cursor.execute('SELECT * FROM sqlite_sequence').fetchall()
        for seq in sequences:
            print(f"  {seq[0]}: {seq[1]}")
    except:
        print("  No sequences found")
    
    # Check record counts
    print("\nRECORD COUNTS:")
    tables = ['clientes', 'productos', 'pedidos', 'ventas', 'cuentas_por_cobrar', 'cuentas_por_pagar']
    for table in tables:
        try:
            count = cursor.execute(f'SELECT COUNT(*) FROM {table}').fetchone()[0]
            print(f"  {table}: {count} records")
        except Exception as e:
            print(f"  {table}: error ({str(e)})")
    
    print("\n" + "="*50)
    conn.close()

def test_reset_endpoint():
    """Test the reset endpoint"""
    try:
        print("Testing reset endpoint...")
        response = requests.post('http://localhost:5000/api/reset-database', 
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Reset successful!")
            print(f"✅ Productos creados: {data.get('productos_creados', 'N/A')}")
            print(f"✅ Clientes creados: {data.get('clientes_creados', 'N/A')}")
            print(f"✅ Secuencias reiniciadas: {data.get('secuencias_reiniciadas', [])}")
            return True
        else:
            print(f"❌ Reset failed: {response.status_code}")
            print(f"❌ Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend - make sure Flask server is running")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("BEFORE RESET:")
    check_database_state()
    
    # Test reset
    success = test_reset_endpoint()
    
    if success:
        print("\nAFTER RESET:")
        check_database_state()
        
        # Test creating new record to verify ID starts at correct number
        print("\nTesting new record creation...")
        try:
            response = requests.post('http://localhost:5000/api/clientes', 
                                   headers={'Content-Type': 'application/json'},
                                   json={
                                       'nombre': 'Test Cliente',
                                       'email': 'test@ejemplo.com',
                                       'telefono': '555-TEST',
                                       'direccion': 'Test Address'
                                   })
            
            if response.status_code in [200, 201]:
                print("✅ New client created successfully")
                
                # Check what ID it got
                conn = sqlite3.connect('database.db')
                cursor = conn.cursor()
                latest = cursor.execute('SELECT id, nombre FROM clientes ORDER BY id DESC LIMIT 1').fetchone()
                if latest:
                    print(f"✅ Latest client ID: #{latest[0]} - {latest[1]}")
                    if latest[0] == 4:  # Should be 4 (after 3 demo clients)
                        print("✅ ID sequence working correctly!")
                    else:
                        print(f"⚠️  Expected ID #4, got #{latest[0]}")
                conn.close()
            else:
                print(f"❌ Failed to create test client: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error testing new record: {str(e)}")
    
    print("\n🎯 TEST COMPLETED")