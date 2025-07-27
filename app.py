from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime
from models import init_db

# Conexión a la base de datos
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row  # Para obtener diccionarios en lugar de tuplas
    return conn

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas
# -------------------- RUTAS DE AUTENTICACIÓN --------------------
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    conn = get_db_connection()
    
    user = conn.execute('''
        SELECT id, name, email, role, created_at 
        FROM usuarios WHERE email = ? AND password = ?
    ''', (data['email'], data['password'])).fetchone()
    
    conn.close()
    
    if user:
        user_data = dict(user)
        return jsonify({
            'success': True,
            'user': user_data,
            'token': f'fake-jwt-token-{user_data["id"]}'
        })
    else:
        return jsonify({
            'success': False, 
            'error': 'Email o contraseña incorrectos'
        }), 401

@app.route('/api/auth/verify', methods=['GET'])
def verify_token():
    # Endpoint para verificar si el token es válido
    auth_header = request.headers.get('Authorization')
    if auth_header and 'fake-jwt-token' in auth_header:
        return jsonify({'valid': True})
    return jsonify({'valid': False}), 401

@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    conn = get_db_connection()
    usuarios = conn.execute('''
        SELECT id, name, email, role, created_at 
        FROM usuarios
    ''').fetchall()
    conn.close()
    return jsonify([dict(usuario) for usuario in usuarios])

# -------------------- RUTAS PARA PRODUCTOS --------------------
@app.route('/api/productos', methods=['GET'])
def get_productos():
    conn = get_db_connection()
    productos = conn.execute('SELECT * FROM productos').fetchall()
    conn.close()
    return jsonify([dict(producto) for producto in productos])

@app.route('/api/productos/<int:id>', methods=['GET'])
def get_producto(id):
    conn = get_db_connection()
    producto = conn.execute('SELECT * FROM productos WHERE id = ?', (id,)).fetchone()
    conn.close()
    return jsonify(dict(producto)) if producto else ('', 404)

@app.route('/api/productos', methods=['POST'])
def agregar_producto():
    data = request.json
    conn = get_db_connection()
    conn.execute('INSERT INTO productos (nombre, tipo, precio, descripcion) VALUES (?, ?, ?, ?)', 
                 (data['nombre'], data['tipo'], data['precio'], data.get('descripcion', '')))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Producto creado'}), 201

@app.route('/api/productos/<int:id>', methods=['PUT'])
def actualizar_producto(id):
    data = request.json
    conn = get_db_connection()
    conn.execute('UPDATE productos SET nombre = ?, tipo = ?, precio = ?, descripcion = ? WHERE id = ?',
                 (data['nombre'], data['tipo'], data['precio'], data.get('descripcion', ''), id))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Producto actualizado'})

@app.route('/api/productos/<int:id>', methods=['DELETE'])
def eliminar_producto(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM productos WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Producto eliminado'})

# -------------------- RUTAS PARA CLIENTES --------------------
@app.route('/api/clientes', methods=['GET'])
def get_clientes():
    conn = get_db_connection()
    clientes = conn.execute('SELECT * FROM clientes').fetchall()
    conn.close()
    return jsonify([dict(cliente) for cliente in clientes])

@app.route('/api/clientes/<int:id>', methods=['GET'])
def get_cliente(id):
    conn = get_db_connection()
    cliente = conn.execute('SELECT * FROM clientes WHERE id = ?', (id,)).fetchone()
    conn.close()
    return jsonify(dict(cliente)) if cliente else ('', 404)

@app.route('/api/clientes', methods=['POST'])
def agregar_cliente():
    data = request.json
    conn = get_db_connection()
    conn.execute('INSERT INTO clientes (nombre, email, telefono, direccion, notas) VALUES (?, ?, ?, ?, ?)',
                 (data['nombre'], data.get('email', ''), data.get('telefono', ''), 
                  data.get('direccion', ''), data.get('notas', '')))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Cliente agregado'}), 201

@app.route('/api/clientes/<int:id>', methods=['PUT'])
def actualizar_cliente(id):
    data = request.json
    conn = get_db_connection()
    conn.execute('UPDATE clientes SET nombre = ?, email = ?, telefono = ?, direccion = ?, notas = ? WHERE id = ?',
                 (data['nombre'], data.get('email', ''), data.get('telefono', ''), 
                  data.get('direccion', ''), data.get('notas', ''), id))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Cliente actualizado'})

@app.route('/api/clientes/<int:id>', methods=['DELETE'])
def eliminar_cliente(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM clientes WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Cliente eliminado'})

# -------------------- RUTAS PARA PEDIDOS --------------------
@app.route('/api/pedidos', methods=['GET'])
def get_pedidos():
    conn = get_db_connection()
    pedidos = conn.execute('''
        SELECT p.*, c.nombre as cliente_nombre 
        FROM pedidos p 
        LEFT JOIN clientes c ON p.cliente_id = c.id
    ''').fetchall()
    
    # Obtener productos para cada pedido
    pedidos_con_productos = []
    for pedido in pedidos:
        pedido_dict = dict(pedido)
        productos = conn.execute('''
            SELECT pp.cantidad, pr.nombre, pr.precio, pr.tipo
            FROM pedido_productos pp
            JOIN productos pr ON pp.producto_id = pr.id
            WHERE pp.pedido_id = ?
        ''', (pedido['id'],)).fetchall()
        pedido_dict['productos'] = [dict(producto) for producto in productos]
        pedidos_con_productos.append(pedido_dict)
    
    conn.close()
    return jsonify(pedidos_con_productos)

@app.route('/api/pedidos', methods=['POST'])
def crear_pedido():
    data = request.json
    conn = get_db_connection()
    
    # Crear el pedido
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO pedidos (cliente_id, fecha, encargado_principal, pago_realizado, notas, estado) 
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        data.get('cliente_id'),
        data.get('fecha', datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
        data.get('encargado_principal', ''),
        data.get('pago_realizado', False),
        data.get('notas', ''),
        data.get('estado', 'pendiente')
    ))
    
    pedido_id = cursor.lastrowid
    
    # Agregar productos al pedido
    if 'productos' in data:
        for producto in data['productos']:
            cursor.execute('''
                INSERT INTO pedido_productos (pedido_id, producto_id, cantidad) 
                VALUES (?, ?, ?)
            ''', (pedido_id, producto['producto_id'], producto.get('cantidad', 1)))
    
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Pedido creado', 'id': pedido_id}), 201

@app.route('/api/pedidos/<int:id>', methods=['PUT'])
def actualizar_pedido(id):
    data = request.json
    conn = get_db_connection()
    
    # Actualizar el pedido principal
    conn.execute('''
        UPDATE pedidos 
        SET cliente_id = ?, fecha = ?, encargado_principal = ?, pago_realizado = ?, notas = ?, estado = ?
        WHERE id = ?
    ''', (
        data.get('cliente_id'),
        data.get('fecha'),
        data.get('encargado_principal', ''),
        data.get('pago_realizado', False),
        data.get('notas', ''),
        data.get('estado', 'pendiente'),
        id
    ))
    
    # Actualizar productos si se proporcionan
    if 'productos' in data:
        # Eliminar productos existentes
        conn.execute('DELETE FROM pedido_productos WHERE pedido_id = ?', (id,))
        # Agregar nuevos productos
        for producto in data['productos']:
            conn.execute('''
                INSERT INTO pedido_productos (pedido_id, producto_id, cantidad) 
                VALUES (?, ?, ?)
            ''', (id, producto['producto_id'], producto.get('cantidad', 1)))
    
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Pedido actualizado'})

@app.route('/api/pedidos/<int:id>/estado', methods=['PUT'])
def actualizar_estado_pedido(id):
    data = request.json
    conn = get_db_connection()
    conn.execute('UPDATE pedidos SET estado = ? WHERE id = ?', (data['estado'], id))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Estado del pedido actualizado'})

@app.route('/api/pedidos/<int:id>/pago', methods=['PUT'])
def actualizar_pago_pedido(id):
    data = request.json
    conn = get_db_connection()
    conn.execute('UPDATE pedidos SET pago_realizado = ? WHERE id = ?', (data['pago_realizado'], id))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Estado de pago actualizado'})

@app.route('/api/pedidos/<int:id>', methods=['DELETE'])
def eliminar_pedido(id):
    conn = get_db_connection()
    # Eliminar productos del pedido primero
    conn.execute('DELETE FROM pedido_productos WHERE pedido_id = ?', (id,))
    # Eliminar el pedido
    conn.execute('DELETE FROM pedidos WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Pedido eliminado'})

# -------------------- RUTAS PARA VENTAS --------------------
@app.route('/api/ventas', methods=['GET'])
def get_ventas():
    conn = get_db_connection()
    ventas = conn.execute('''
        SELECT v.*, p.nombre as producto_nombre, c.nombre as cliente_nombre 
        FROM ventas v 
        JOIN productos p ON v.producto_id = p.id
        LEFT JOIN clientes c ON v.cliente_id = c.id
    ''').fetchall()
    conn.close()
    return jsonify([dict(venta) for venta in ventas])

@app.route('/api/ventas', methods=['POST'])
def registrar_venta():
    data = request.json
    conn = get_db_connection()
    
    # Calcular el total (precio * cantidad)
    producto = conn.execute('SELECT precio FROM productos WHERE id = ?', 
                           (data['producto_id'],)).fetchone()
    total = producto['precio'] * data['cantidad']
    
    conn.execute('''
        INSERT INTO ventas (cliente_id, producto_id, cantidad, total, fecha) 
        VALUES (?, ?, ?, ?, ?)
    ''', (
        data.get('cliente_id'),
        data['producto_id'], 
        data['cantidad'], 
        total, 
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Venta registrada'}), 201

@app.route('/api/ventas/<int:id>', methods=['DELETE'])
def eliminar_venta(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM ventas WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Venta eliminada'})

# -------------------- RUTA DE INICIALIZACIÓN --------------------
@app.route('/api/init-db', methods=['POST'])
def initialize_database():
    init_db()
    return jsonify({'mensaje': 'Base de datos inicializada correctamente'})

if __name__ == '__main__':
    init_db()  # Inicializar la base de datos al arrancar
    app.run(debug=True)

