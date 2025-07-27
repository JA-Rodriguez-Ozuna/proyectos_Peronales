-- Actualizar productos con los servicios reales de Plus Graphics
USE pos_system;

-- Limpiar productos existentes
DELETE FROM products;

-- Insertar los nuevos productos/servicios basados en la imagen
INSERT INTO products (name, description, price, cost, stock, category_id, sku, status) VALUES
('SCENE ANIMATION', 'Animación completa de escena', 2079.20, 1500.00, 0, 2, 'VFX001', 'active'),
('SCENE', 'Diseño y composición de escena', 1315.06, 1000.00, 0, 2, 'VFX002', 'active'),
('ANIMATED 2.0 FRAME', 'Frame animado versión 2.0', 805.60, 600.00, 0, 2, 'VFX003', 'active'),
('TRANSITION', 'Transición animada', 725.67, 500.00, 0, 2, 'VFX004', 'active'),
('INTRO', 'Introducción animada', 275.84, 200.00, 0, 2, 'VFX005', 'active'),
('LOGO ANIMATION', 'Animación de logo', 215.91, 150.00, 0, 2, 'VFX006', 'active'),
('POST (1 SLIDE)', 'Post para redes sociales (1 slide)', 69.93, 40.00, 0, 4, 'GFX001', 'active'),
('ANIMATED OUTRO', 'Outro animado', 65.98, 45.00, 0, 2, 'VFX007', 'active'),
('POST RAIMATION', 'Post con animación simple', 31.38, 20.00, 0, 4, 'GFX002', 'active'),
('2.0 FRAME', 'Frame versión 2.0', 27.98, 18.00, 0, 4, 'GFX003', 'active'),
('LOWERTHIRD', 'Lower third gráfico', 26.87, 15.00, 0, 4, 'GFX004', 'active');

-- Actualizar categorías para reflejar GFX y VFX
UPDATE categories SET name = 'VFX', description = 'Efectos visuales y animación' WHERE id = 2;
UPDATE categories SET name = 'GFX', description = 'Diseño gráfico y elementos estáticos' WHERE id = 4;

-- Agregar categoría VFX si no existe
INSERT IGNORE INTO categories (id, name, description) VALUES 
(2, 'VFX', 'Efectos visuales y animación'),
(4, 'GFX', 'Diseño gráfico y elementos estáticos');
