import sqlite3

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Tabla de usuarios (NUEVA) - Simplificada
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'employee',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla de productos actualizada con tipo y descripción
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            tipo TEXT NOT NULL,
            precio REAL NOT NULL,
            descripcion TEXT
        )
    ''')
    
    # Tabla de clientes actualizada con todos los campos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT,
            telefono TEXT,
            direccion TEXT,
            notas TEXT
        )
    ''')
    
    # Tabla de pedidos actualizada con cliente, fecha, encargado, pago y notas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER,
            fecha TEXT NOT NULL,
            encargado_principal TEXT,
            pago_realizado BOOLEAN DEFAULT FALSE,
            notas TEXT,
            estado TEXT DEFAULT 'pendiente',
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        )
    ''')
    
    # Tabla intermedia para productos/servicios en pedidos (relación muchos a muchos)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pedido_productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido_id INTEGER,
            producto_id INTEGER,
            cantidad INTEGER DEFAULT 1,
            FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
            FOREIGN KEY (producto_id) REFERENCES productos(id)
        )
    ''')
    
    # Tabla de ventas actualizada con cliente
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ventas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER,
            producto_id INTEGER,
            cantidad INTEGER,
            total REAL,
            fecha TEXT,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id),
            FOREIGN KEY (producto_id) REFERENCES productos(id)
        )
    ''')
    
    # Agregar columnas faltantes
    add_missing_columns(cursor)
    
    # Insertar usuarios por defecto si no existen
    seed_users(cursor)
    
    conn.commit()
    conn.close()

def add_missing_columns(cursor):
    """Agrega columnas que puedan faltar"""
    try:
        cursor.execute("ALTER TABLE pedido_productos ADD COLUMN assigned_payment REAL DEFAULT 0")
        print("✅ Agregada columna assigned_payment a pedido_productos")
    except sqlite3.OperationalError:
        pass  # Ya existe

def seed_users(cursor):
    """Poblar con usuarios predefinidos para Plus Graphics"""
    users = [
        # Admin
        ("Ariel Guerrero", "admin@plusgraphics.com", "admin123", "admin"),
        
        # Empleados
        ("Vex", "vex@plusgraphics.com", "vex123", "employee"),
        ("Gilbert", "gilbert@plusgraphics.com", "gilbert123", "employee"),
        ("Randy", "randy@plusgraphics.com", "randy123", "employee"),
        ("Sergio", "sergio@plusgraphics.com", "sergio123", "employee"),
        ("Hiroshi", "hiroshi@plusgraphics.com", "hiroshi123", "employee"),
        ("Rene", "rene@plusgraphics.com", "rene123", "employee"),
    ]
    
    for user in users:
        cursor.execute('''
            INSERT OR IGNORE INTO usuarios (name, email, password, role) 
            VALUES (?, ?, ?, ?)
        ''', user)

if __name__ == '__main__':
    init_db()
    print("Base de datos inicializada correctamente")