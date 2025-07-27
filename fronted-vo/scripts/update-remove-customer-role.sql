-- Actualizar la estructura para eliminar el rol de cliente
USE pos_system;

-- Actualizar la tabla de usuarios para eliminar el rol de cliente
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'employee') DEFAULT 'employee';

-- Eliminar usuarios con rol 'customer'
DELETE FROM users WHERE role = 'customer';

-- Conservar solo los tipos de usuarios admin y employee
UPDATE subscription_plans 
SET limits = JSON_REMOVE(limits, '$.customers')
WHERE JSON_CONTAINS_PATH(limits, 'one', '$.customers');
