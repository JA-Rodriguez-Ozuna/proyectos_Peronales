-- Crear tablas para funcionalidad SaaS
USE pos_system;

-- Tabla de tenants/empresas
CREATE TABLE tenants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    domain VARCHAR(100),
    plan_id INT,
    status ENUM('trial', 'active', 'suspended', 'cancelled') DEFAULT 'trial',
    trial_ends_at TIMESTAMP NULL,
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de planes de suscripción
CREATE TABLE subscription_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle ENUM('monthly', 'yearly') DEFAULT 'monthly',
    features JSON,
    limits JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de suscripciones
CREATE TABLE subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    plan_id INT NOT NULL,
    status ENUM('active', 'cancelled', 'past_due', 'unpaid') DEFAULT 'active',
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    stripe_subscription_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Tabla de facturas
CREATE TABLE invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    subscription_id INT,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('draft', 'open', 'paid', 'void', 'uncollectible') DEFAULT 'open',
    due_date DATE NOT NULL,
    paid_at TIMESTAMP NULL,
    stripe_invoice_id VARCHAR(100),
    invoice_pdf_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);

-- Tabla de uso/métricas por tenant
CREATE TABLE tenant_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    metric_name VARCHAR(50) NOT NULL,
    metric_value INT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tenant_metric_period (tenant_id, metric_name, period_start)
);

-- Actualizar tabla de usuarios para incluir tenant_id
ALTER TABLE users ADD COLUMN tenant_id INT;
ALTER TABLE users ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id);

-- Actualizar todas las tablas principales para incluir tenant_id
ALTER TABLE products ADD COLUMN tenant_id INT;
ALTER TABLE products ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id);

ALTER TABLE customers ADD COLUMN tenant_id INT;
ALTER TABLE customers ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id);

ALTER TABLE orders ADD COLUMN tenant_id INT;
ALTER TABLE orders ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id);

ALTER TABLE sales ADD COLUMN tenant_id INT;
ALTER TABLE sales ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id);

-- Insertar planes de suscripción
INSERT INTO subscription_plans (name, slug, description, price, billing_cycle, features, limits) VALUES
(
    'Básico',
    'basico',
    'Perfecto para pequeños negocios',
    29.00,
    'monthly',
    JSON_ARRAY('Ventas básicas', 'Reportes básicos', 'Soporte por email'),
    JSON_OBJECT('products', 100, 'users', 1, 'orders_per_month', 500, 'storage_gb', 1)
),
(
    'Profesional',
    'profesional',
    'Para negocios en crecimiento',
    79.00,
    'monthly',
    JSON_ARRAY('Productos ilimitados', 'Cuentas por cobrar/pagar', 'API básica', 'Soporte prioritario'),
    JSON_OBJECT('products', -1, 'users', 5, 'orders_per_month', 5000, 'storage_gb', 10)
),
(
    'Empresarial',
    'empresarial',
    'Para empresas establecidas',
    199.00,
    'monthly',
    JSON_ARRAY('Todo ilimitado', 'API completa', 'Múltiples sucursales', 'Soporte 24/7'),
    JSON_OBJECT('products', -1, 'users', -1, 'orders_per_month', -1, 'storage_gb', 100)
);

-- Insertar tenants de ejemplo
INSERT INTO tenants (name, slug, plan_id, status) VALUES
('Plus Graphics', 'plus-graphics', 2, 'active'),
('Mi Tienda Online', 'mi-tienda-online', 1, 'active'),
('Empresa Demo', 'empresa-demo', 3, 'trial');

-- Actualizar usuarios existentes con tenant_id
UPDATE users SET tenant_id = 1 WHERE id IN (1, 2);
UPDATE users SET tenant_id = 2 WHERE id = 3;

-- Actualizar datos existentes con tenant_id
UPDATE products SET tenant_id = 1;
UPDATE customers SET tenant_id = 1;
UPDATE orders SET tenant_id = 1;
