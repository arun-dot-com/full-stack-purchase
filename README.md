# Purchase Management Module

This is a simple purchase management module developed using HTML, CSS, JavaScript, Node.js, and MySQL. The module allows users to manage purchase orders, including creating, viewing, modifying, and approving orders.

## Features

- **Create Orders:** Users can create new purchase orders with product names and quantities.
- **Modify Orders:** Existing orders can be modified with updated details.
- **View Orders:** Users can view all the orders in a tabular format.
- **Approve Orders:** Supervisors can approve or reject orders.
- **CSV Download:** Orders can be downloaded as a CSV file for reporting purposes.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) 
- [MySQL](https://dev.mysql.com/downloads/installer/) 

## Installation

## Clone the repository 

   ```bash
   git clone https://github.com/yourusername/purchase-management-module.git
   cd purchase-management-module
```

## Unzip the `node_modules` folder

Make sure to unzip the `node_modules` folder inside the project directory.

## Configure MySQL Database

1. **Create a MySQL database.**
2. **Update the database configuration in `/database.js` with your database credentials.**

## Install Dependencies

If the `node_modules` folder is not provided, install dependencies using:


```bash
npm install
```

## Start the Application

Start the application by running:

```bash
npm start
```

## Access the Application

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Usage

### User Role:

- Create and modify orders.
- View the list of orders.

### Supervisor Role:

- View and approve orders.
- Download orders as CSV.
  
### Admin Role and Authentication:
- Under development


