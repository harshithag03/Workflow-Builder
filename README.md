# Workflow-Builder

A custom workflow builder application for quality management systems that enables users to create, edit, and manage approval workflows with customizable steps, conditions, and role assignments.



## Overview

This application provides a simplified workflow builder module for quality management systems. Quality managers can create custom approval workflows with different steps (such as approvals, notifications, tasks), define conditions between steps, assign roles to individual steps, and visualize the workflow structure.

## Features

- **Workflow Management**
  - Create, view, edit, and delete workflows
  - Track workflow status (active/inactive)

- **Step Builder**
  - Add steps with different types (TASK, APPROVAL, NOTIFICATION)
  - Configure step details (name, description, priority)
  - Edit and remove steps as needed

- **Conditional Logic**
  - Define conditions between steps (ALWAYS, IF_APPROVED, IF_REJECTED)
  - Create branching workflows based on approval decisions

- **Role Assignment** 
  - Assign roles to individual steps (Quality Manager, Department Head, etc.)
  - Track who is responsible for each step in the workflow

- **Workflow Visualization**
  - Clear visual representation of workflow steps and their connections
  - Interactive editing of the workflow structure

## Tech Stack

### Frontend
- **Next.js** - React framework for server-rendered applications
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **Axios** - HTTP client for API requests
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime environment
- **Express** - Web application framework
- **MySQL** - Relational database
- **mysql2** - MySQL client for Node.js
- **cors** - Middleware for enabling CORS
- **dotenv** - Environment variable management

## Project Structure

```
workflow-builder/
├── frontend/                # Next.js frontend application
│   ├── components/          # Reusable UI components
│   │   ├── Layout/          # Layout components
│   │   ├── Workflow/        # Workflow-related components
│   │   ├── Steps/           # Step-related components
│   │   └── UI/              # Generic UI components
│   ├── pages/               # Next.js pages
│   ├── styles/              # CSS/Tailwind styles
│   ├── lib/                 # Utility functions & API services
│   └── public/              # Static assets
│
├── backend/                 # Express.js backend
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── db/                  # Database configuration
│   │   └── schema.sql       # SQL schema
│   └── server.js            # Express server
│
└── README.md                # Project documentation
```

## Installation

### Prerequisites
- Node.js (v14 or later)
- MySQL (v8 or later)

### Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE workflow_builder;
```

2. Run the database schema SQL script:

```bash
mysql -u <username> -p workflow_builder < backend/db/schema.sql
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your database configuration:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=workflow_builder
PORT=5000
```

4. Start the backend server:

```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with your API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:

```bash
npm run dev
```

The frontend application will be available at `http://localhost:3000`.

## Usage

### Creating a Workflow

1. Navigate to the home page
2. Click "New Workflow"
3. Enter a name and description
4. Click "Create"

### Adding Steps to a Workflow

1. Open a workflow from the list
2. Click "Add Step"
3. Fill in the step details:
   - Name
   - Step Type (TASK, APPROVAL, NOTIFICATION)
   - Description
   - Priority (optional)
   - Assigned Roles (optional)
4. Click "Add Step"

### Creating Connections Between Steps

1. In the workflow designer view
2. Click "Add Connection"
3. Select source and target steps
4. Choose a condition type (ALWAYS, IF_APPROVED, IF_REJECTED)
5. Click "Add Connection"

### Exporting a Workflow

1. Open a workflow from the list
2. Click the "Export" button
3. The workflow will be downloaded as a JSON file

## API Documentation

### Workflows

- `GET /api/workflows` - Retrieve all workflows
- `GET /api/workflows/:id` - Retrieve a specific workflow (including its steps)
- `POST /api/workflows` - Create a new workflow
- `PUT /api/workflows/:id` - Update an existing workflow
- `DELETE /api/workflows/:id` - Delete a workflow

### Steps

- `POST /api/workflows/:id/steps` - Add a new step to a workflow
- `GET /api/steps/:id` - Retrieve a specific step with its roles
- `PUT /api/steps/:id` - Update a step
- `DELETE /api/steps/:id` - Delete a step

### Connections

- `POST /api/connections` - Create a connection between steps
- `PUT /api/connections/:id` - Update a connection
- `DELETE /api/connections/:id` - Delete a connection

### Roles

- `POST /api/steps/:id/roles` - Assign a role to a step
- `DELETE /api/roles/:id` - Delete a role assignment

## Design Decisions

### Frontend Architecture

- **Component-Based Structure**: The frontend is organized into reusable components that represent different parts of the workflow builder.
- **Tailwind CSS**: Provides a clean, responsive design with minimal custom CSS.
- **Modal Pattern**: Uses modal dialogs for creating and editing workflows, steps, and connections.
- **Separation of Concerns**: API services are separated from UI components for better maintainability.

### Backend Architecture

- **Model-Controller Pattern**: The backend follows a model-controller pattern where models handle database operations and controllers handle request/response logic.
- **Relational Database**: MySQL is used to store workflow data in a normalized schema.
- **RESTful API**: The API follows RESTful conventions with appropriate HTTP methods.


## License

[MIT](LICENSE)
