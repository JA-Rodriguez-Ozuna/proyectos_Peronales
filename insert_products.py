import sqlite3
import os

def add_status_column_if_not_exists(cursor):
    """Agrega la columna status si no existe"""
    try:
        # Verificar si la columna status ya existe
        cursor.execute("PRAGMA table_info(productos)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'status' not in columns:
            cursor.execute("ALTER TABLE productos ADD COLUMN status TEXT DEFAULT 'Activo'")
            print("✅ Columna 'status' agregada exitosamente")
        else:
            print("ℹ️  La columna 'status' ya existe")
    except Exception as e:
        print(f"❌ Error al agregar columna status: {e}")

def insert_products():
    """Inserta los productos en la base de datos"""
    
    # Lista de productos (sin id, ya que es AUTOINCREMENT)
    products = [
        ("SCENE ANIMATION", "vfx", 2079.2, "", "Activo"),
        ("SCENE", "vfx", 1315.06, "", "Activo"),
        ("ANIMATED 2.0 FRAME", "vfx", 805.6, "", "Activo"),
        ("TRANSITION", "vfx", 725.67, "", "Activo"),
        ("INTRO", "vfx", 275.84, "", "Activo"),
        ("LOGO ANIMATION", "vfx", 215.91, "", "Activo"),
        ("POST (1 SLIDE)", "gfx", 69.93, "", "Activo"),
        ("ANIMATED OUTRO", "vfx", 65.98, "", "Activo"),
        ("POST RAIMATION", "gfx", 31.38, "", "Activo"),
        ("2.0 FRAME", "gfx", 27.98, "", "Activo"),
        ("LOWERTHIRD", "gfx", 26.87, "", "Activo"),
    ]
    
    # Conectar a la base de datos (ajusta la ruta según tu archivo)
    db_path = "database.db"  # Cambia esto por la ruta de tu base de datos
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Agregar columna status si no existe
        add_status_column_if_not_exists(cursor)
        
        # Verificar productos existentes para evitar duplicados (por nombre)
        cursor.execute("SELECT nombre FROM productos")
        existing_names = {row[0] for row in cursor.fetchall()}
        
        # Filtrar productos que no existen
        new_products = [product for product in products if product[0] not in existing_names]
        
        if new_products:
            # Insertar productos nuevos
            insert_query = """
            INSERT INTO productos (nombre, tipo, precio, descripcion, status) 
            VALUES (?, ?, ?, ?, ?)
            """
            
            cursor.executemany(insert_query, new_products)
            conn.commit()
            
            print(f"✅ {len(new_products)} productos insertados exitosamente:")
            for product in new_products:
                print(f"   - {product[0]} (${product[2]})")
        else:
            print("ℹ️  Todos los productos ya existen en la base de datos")
        
        # Mostrar productos duplicados si los hay
        duplicate_products = [product for product in products if product[0] in existing_names]
        if duplicate_products:
            print(f"⚠️  {len(duplicate_products)} productos ya existían:")
            for product in duplicate_products:
                print(f"   - {product[0]}")
        
        # Verificar la inserción
        cursor.execute("SELECT COUNT(*) FROM productos")
        total_products = cursor.fetchone()[0]
        print(f"\n📊 Total de productos en la base de datos: {total_products}")
        
    except sqlite3.Error as e:
        print(f"❌ Error de base de datos: {e}")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
    finally:
        if conn:
            conn.close()
            print("🔌 Conexión a la base de datos cerrada")

def show_all_products():
    """Muestra todos los productos de la base de datos"""
    db_path = "database.db"  # Cambia esto por la ruta de tu base de datos
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM productos ORDER BY precio DESC")
        products = cursor.fetchall()
        
        if products:
            print("\n📋 Productos en la base de datos:")
            print("-" * 90)
            print(f"{'ID':<10} {'Nombre':<25} {'Tipo':<8} {'Precio':<10} {'Descripcion':<15} {'Status':<8}")
            print("-" * 90)
            
            for product in products:
                desc = product[3] if len(product) > 3 and product[3] else "N/A"
                status = product[4] if len(product) > 4 else "N/A"
                print(f"{product[0]:<10} {product[1]:<25} {product[2]:<8} ${product[3]:<9.2f} {desc:<15} {status:<8}")
        else:
            print("📭 No hay productos en la base de datos")
            
    except sqlite3.Error as e:
        print(f"❌ Error al consultar productos: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("🚀 Iniciando inserción de productos...")
    print("=" * 50)
    
    # Insertar productos
    insert_products()
    
    # Mostrar todos los productos
    show_all_products()
    
    print("\n✨ Proceso completado!")