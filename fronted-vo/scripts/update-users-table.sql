-- Update users table with better structure for authentication
USE pos_system;

-- Drop existing users table if it exists
DROP TABLE IF EXISTS users;

-- Create updated users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee', 'customer') DEFAULT 'customer',
    phone VARCHAR(20),
    address TEXT,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert demo users with hashed passwords (in production, use proper password hashing)
INSERT INTO users (name, email, password_hash, role, phone, status, email_verified) VALUES
('Ariel Admin', 'admin@plusgraphics.com', '$2b$10$hashedpassword1', 'admin', '+1 234 567 8900', 'active', TRUE),
('María Empleada', 'maria@plusgraphics.com', '$2b$10$hashedpassword2', 'employee', '+1 234 567 8901', 'active', TRUE),
('Juan Cliente', 'juan@cliente.com', '$2b$10$hashedpassword3', 'customer', '+1 234 567 8902', 'active', TRUE),
('Ana Cliente', 'ana@cliente.com', '$2b$10$hashedpassword4', 'customer', '+1 234 567 8903', 'active', TRUE);

-- Create sessions table for better session management
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create password reset tokens table
CREATE TABLE password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Update customers table to reference users table
ALTER TABLE customers ADD COLUMN user_id INT NULL;
ALTER TABLE customers ADD FOREIGN KEY (user_id) REFERENCES users(id);

-- Create user permissions table for fine-grained access control
CREATE TABLE user_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    permission VARCHAR(50) NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id),
    UNIQUE KEY unique_user_permission (user_id, permission)
);

-- Insert default permissions for roles
INSERT INTO user_permissions (user_id, permission) VALUES
-- Admin permissions (user_id 1)
(1, 'dashboard.view'),
(1, 'products.create'),
(1, 'products.read'),
(1, 'products.update'),
(1, 'products.delete'),
(1, 'sales.create'),
(1, 'sales.read'),
(1, 'orders.create'),
(1, 'orders.read'),
(1, 'orders.update'),
(1, 'customers.create'),
(1, 'customers.read'),
(1, 'customers.update'),
(1, 'customers.delete'),
(1, 'receivables.read'),
(1, 'receivables.update'),
(1, 'payables.read'),
(1, 'payables.update'),
(1, 'reports.read'),
(1, 'settings.update'),

-- Employee permissions (user_id 2)
(2, 'dashboard.view'),
(2, 'products.read'),
(2, 'products.update'),
(2, 'sales.create'),
(2, 'sales.read'),
(2, 'orders.create'),
(2, 'orders.read'),
(2, 'orders.update'),
(2, 'customers.create'),
(2, 'customers.read'),
(2, 'customers.update'),
(2, 'receivables.read');
