-- Insertar datos de ejemplo
USE pos_system;

-- Insertar categorías
INSERT INTO categories (name, description) VALUES
('Textil', 'Productos textiles personalizados'),
('Sublimación', 'Productos sublimados'),
('Impresión', 'Servicios de impresión'),
('Papelería', 'Productos de papelería'),
('Acrílico', 'Productos en acrílico');

-- Insertar productos
INSERT INTO products (name, description, price, cost, stock, category_id, sku) VALUES
('Camiseta Personalizada', 'Camiseta 100% algodón personalizable', 25.00, 15.00, 150, 1, 'TEX001'),
('Taza Sublimada', 'Taza cerámica para sublimación', 12.50, 8.00, 75, 2, 'SUB001'),
('Banner Publicitario', 'Banner en vinilo para publicidad', 45.00, 30.00, 25, 3, 'IMP001'),
('Tarjetas de Presentación', 'Tarjetas en papel couché', 15.00, 10.00, 200, 4, 'PAP001'),
('Gorra Bordada', 'Gorra con bordado personalizado', 18.00, 12.00, 80, 1, 'TEX002'),
('Llavero Acrílico', 'Llavero personalizado en acrílico', 8.00, 5.00, 120, 5, 'ACR001');

-- Insertar clientes
INSERT INTO customers (name, email, phone, address, total_orders, total_spent) VALUES
('MECA Corporation', 'contacto@meca.com', '+1 234 567 8900', '123 Business Ave, Ciudad', 15, 2400.00),
('NIKE Store', 'orders@nike.com', '+1 234 567 8901', '456 Commerce St, Ciudad', 8, 1200.00),
('Local Business', 'info@localbiz.com', '+1 234 567 8902', '789 Main St, Ciudad', 3, 450.00),
('Startup Tech', 'hello@startup.com', '+1 234 567 8903', '321 Innovation Blvd, Ciudad', 5, 800.00);

-- Insertar pedidos
INSERT INTO orders (customer_id, order_number, total_amount, status, payment_status, due_date, notes) VALUES
(1, 'ORD001', 400.00, 'in_progress', 'pending', '2024-01-15', 'Pedido urgente para evento'),
(2, 'ORD002', 300.00, 'pending', 'pending', '2024-01-20', 'Diseño personalizado requerido'),
(1, 'ORD003', 600.00, 'completed', 'paid', '2024-01-10', 'Pedido completado satisfactoriamente'),
(3, 'ORD004', 250.00, 'in_progress', 'pending', '2024-01-25', 'Primera orden del cliente');

-- Insertar detalles de pedidos
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
(1, 1, 10, 25.00, 250.00),
(1, 2, 12, 12.50, 150.00),
(2, 3, 5, 45.00, 225.00),
(2, 4, 5, 15.00, 75.00),
(3, 1, 20, 25.00, 500.00),
(3, 5, 5, 18.00, 90.00),
(3, 6, 2, 8.00, 16.00);

-- Insertar cuentas por cobrar
INSERT INTO receivables (customer_id, order_id, invoice_number, amount, balance, due_date, status) VALUES
(1, 1, 'INV001', 400.00, 400.00, '2024-01-15', 'pending'),
(2, 2, 'INV002', 300.00, 300.00, '2024-01-20', 'pending'),
(3, 4, 'INV003', 250.00, 250.00, '2024-01-25', 'pending');

-- Insertar proveedores
INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES
('Textiles Mayorista', 'Juan Pérez', 'ventas@textiles.com', '+1 555 0101', '100 Textile St, Ciudad'),
('Suministros Gráficos', 'María García', 'info@graficos.com', '+1 555 0102', '200 Print Ave, Ciudad'),
('Materiales Premium', 'Carlos López', 'contacto@premium.com', '+1 555 0103', '300 Quality Rd, Ciudad');

-- Insertar cuentas por pagar
INSERT INTO payables (supplier_id, invoice_number, amount, balance, due_date, description) VALUES
(1, 'PROV001', 1500.00, 1500.00, '2024-01-30', 'Compra de camisetas en blanco'),
(2, 'PROV002', 800.00, 800.00, '2024-02-05', 'Tintas y materiales de impresión'),
(3, 'PROV003', 600.00, 600.00, '2024-02-10', 'Materiales premium para sublimación');

-- Insertar movimientos de inventario
INSERT INTO inventory_movements (product_id, type, quantity, reference_type, notes) VALUES
(1, 'in', 200, 'purchase', 'Compra inicial de camisetas'),
(2, 'in', 100, 'purchase', 'Compra inicial de tazas'),
(3, 'in', 50, 'purchase', 'Compra inicial de material para banners'),
(4, 'in', 500, 'purchase', 'Compra inicial de papel para tarjetas'),
(5, 'in', 100, 'purchase', 'Compra inicial de gorras'),
(6, 'in', 150, 'purchase', 'Compra inicial de acrílico');
