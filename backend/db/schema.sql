-- Create database
CREATE DATABASE IF NOT EXISTS workflow_builder;
USE workflow_builder;

-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS step_roles;
DROP TABLE IF EXISTS step_connections;
DROP TABLE IF EXISTS workflow_steps;
DROP TABLE IF EXISTS workflows;

-- Create workflows table
CREATE TABLE workflows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create workflow_steps table
CREATE TABLE workflow_steps (
  id INT PRIMARY KEY AUTO_INCREMENT,
  workflow_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  step_type ENUM('TASK', 'APPROVAL', 'NOTIFICATION') NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
);

-- Create step_connections table
CREATE TABLE step_connections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  from_step_id INT NOT NULL,
  to_step_id INT NOT NULL,
  condition_type ENUM('ALWAYS', 'IF_APPROVED', 'IF_REJECTED') DEFAULT 'ALWAYS',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_step_id) REFERENCES workflow_steps(id) ON DELETE CASCADE,
  FOREIGN KEY (to_step_id) REFERENCES workflow_steps(id) ON DELETE CASCADE
);

-- Create step_roles table
CREATE TABLE step_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  step_id INT NOT NULL,
  role_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (step_id) REFERENCES workflow_steps(id) ON DELETE CASCADE
);

-- Insert some sample data for testing
INSERT INTO workflows (name, description, is_active) VALUES 
('Document Approval', 'Standard document approval workflow', TRUE),
('Change Request', 'Process for handling change requests', TRUE);

INSERT INTO workflow_steps (workflow_id, name, description, step_type, order_index) VALUES 
(1, 'Initial Review', 'First review by department head', 'APPROVAL', 1),
(1, 'Quality Check', 'Quality assurance review', 'APPROVAL', 2),
(1, 'Final Approval', 'Final approval by senior management', 'APPROVAL', 3),
(1, 'Notification', 'Notify all stakeholders of approval', 'NOTIFICATION', 4);

INSERT INTO step_connections (from_step_id, to_step_id, condition_type) VALUES 
(1, 2, 'IF_APPROVED'),
(2, 3, 'IF_APPROVED'),
(3, 4, 'IF_APPROVED');

INSERT INTO step_roles (step_id, role_name) VALUES 
(1, 'Department Head'),
(2, 'Quality Manager'),
(3, 'Senior Management');