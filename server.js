








const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database'); // Ensure the path is correct

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// Connect to MySQL database
connection.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL database");
});

// User registration
app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, email, password, role], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: 'User registered successfully' });
    });
});

// User login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    connection.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        // Login successful, send user details
        const user = results[0];
        res.json({ success: true, userId: user.id, role: user.role });
    });
});

//create orders
// Initialize nextOrderId
app.post('/api/orders', (req, res) => {
  const { productName, quantity } = req.body;

  console.log('Received order creation request:', { productName, quantity });

  if (!productName || quantity < 1) {
      console.error('Invalid input:', { productName, quantity });
      return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  const sql = 'INSERT INTO orders (productName, quantity) VALUES (?, ?)';
  connection.query(sql, [productName, quantity], (err, results) => {
      if (err) {
          console.error('Error creating order:', err);
          return res.status(500).json({ success: false, message: 'Error creating order' });
      }

      const orderId = results.insertId; // Get the generated order ID
      console.log('Order created successfully:', { orderId });
      res.json({ success: true, orderId }); // Return the order ID
  });
});


// Fetch all orders
app.get('/api/orders', (req, res) => {
  const sql = 'SELECT * FROM orders';
  connection.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching orders:', err);
          return res.status(500).json({ success: false, message: 'Error fetching orders' });
      }
      res.json({ success: true, orders: results });
  });
});

// Modify an order
app.put('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const { productName, quantity } = req.body;

  const sql = 'UPDATE orders SET productName = ?, quantity = ? WHERE orderId = ?';
  connection.query(sql, [productName, quantity, orderId], (err) => {
      if (err) {
          console.error('Error modifying order:', err);
          return res.status(500).json({ success: false, message: 'Error modifying order' });
      }
      res.json({ success: true, message: 'Order modified successfully' });
  });
});




// Handle modifying orders
app.put('/api/orders/:id', (req, res) => {
  const { productName, quantity } = req.body;
  const { id } = req.params;

  if (!productName || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  const sql = 'UPDATE orders SET productName = ?, quantity = ? WHERE orderId = ?';
  connection.query(sql, [productName, quantity, id], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Error updating order' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ success: false, message: 'Order not found' });
      }
      res.json({ success: true });
  });
});

//collect pending orders
app.get('/api/orders', (req, res) => {
  const sql = 'SELECT * FROM orders WHERE status = "Pending"';
  connection.query(sql, (err, results) => {
      if (err) {
          console.error('Error retrieving orders:', err);
          return res.status(500).json({ success: false, message: 'Error retrieving orders' });
      }
      res.json({ success: true, orders: results });
  });
});


//approve orders
app.post('/api/approve-orders', (req, res) => {
  const { orderIds } = req.body;

  // Validate orderIds
  if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No orders selected or invalid input' });
  }

  console.log('Order IDs:', orderIds); // Debugging output

  // Prepare SQL query
  const placeholders = orderIds.map(() => '?').join(',');
  const sql = `UPDATE orders SET status = 'Approved' WHERE orderId IN (${placeholders})`;

  // Execute query
  connection.query(sql, orderIds, (err) => {
      if (err) {
          console.error('Error approving orders:', err);
          return res.status(500).json({ success: false, message: 'Failed to approve orders' });
      }
      res.json({ success: true });
  });
});


// Route to handle deleting an order
/*
app.delete('/api/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    if (!orderId) {
        console.error('Order ID is required');
        return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const sql = 'DELETE FROM orders WHERE orderId = ?';
    connection.query(sql, [orderId], (error, results) => {
        if (error) {
            console.error('Error executing query: ', error);
            return res.status(500).json({ success: false, message: 'Failed to delete order' });
        }

        console.log('Delete results: ', results);

        if (results.affectedRows > 0) {
            res.json({ success: true, message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    });
});

*/

// Handle downloading orders as CSV (optional)
app.get('/api/orders/csv', (req, res) => {
  const sql = 'SELECT * FROM orders';
  connection.query(sql, (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Error fetching orders' });
      }
      const csv = results.map(order => `${order.orderId},${order.productName},${order.quantity}`).join('\n');
      res.header('Content-Type', 'text/csv');
      res.attachment('orders.csv');
      res.send(csv);
  });
});


// Create a new order
app.post('/api/create-order', (req, res) => {
    const { productName, quantity } = req.body;
    if (!productName || !quantity || quantity <= 0) {
        return res.json({ success: false, message: 'Invalid input' });
    }

    const sql = 'INSERT INTO orders (productName, quantity, status) VALUES (?, ?, ?)';
    connection.query(sql, [productName, quantity, 'Pending'], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Error creating order' });
        }
        res.json({ success: true, message: 'Order created successfully', orderId: result.insertId });
    });
});

// Modify an existing order
app.post('/api/modify-order', (req, res) => {
    const { orderId, productName, quantity } = req.body;
    if (!orderId || !productName || quantity <= 0) {
        return res.json({ success: false, message: 'Invalid input' });
    }

    const sql = 'UPDATE orders SET productName = ?, quantity = ? WHERE orderId = ?';
    connection.query(sql, [productName, quantity, orderId], (err) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Error modifying order' });
        }
        res.json({ success: true, message: 'Order modified successfully' });
    });
});



// Create a new order
app.post('/api/create-order', (req, res) => {
    const { productName, quantity } = req.body;
    if (!productName || !quantity || quantity <= 0) {
        return res.json({ success: false, message: 'Invalid input' });
    }

    const sql = 'INSERT INTO orders (productName, quantity, status) VALUES (?, ?, ?)';
    connection.query(sql, [productName, quantity, 'Pending'], (err) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Error creating order' });
        }
        res.json({ success: true, message: 'Order created successfully' });
    });
});

// Modify an existing order
app.post('/api/modify-order', (req, res) => {
    const { orderId, productName, quantity } = req.body;
    if (!orderId || !productName || quantity <= 0) {
        return res.json({ success: false, message: 'Invalid input' });
    }

    const sql = 'UPDATE orders SET productName = ?, quantity = ? WHERE orderId = ?';
    connection.query(sql, [productName, quantity, orderId], (err) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Error modifying order' });
        }
        res.json({ success: true, message: 'Order modified successfully' });
    });
});

// Download orders as CSV
app.get('/api/download-csv', (req, res) => {
    connection.query('SELECT * FROM orders', (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Error fetching orders' });
        }

        const csvWriter = createObjectCsvWriter({
            path: 'orders.csv',
            header: [
                { id: 'orderId', title: 'Order ID' },
                { id: 'productName', title: 'Product Name' },
                { id: 'quantity', title: 'Quantity' },
                { id: 'status', title: 'Status' }
            ]
        });

        csvWriter.writeRecords(results)
            .then(() => {
                res.download('orders.csv', 'orders.csv', (err) => {
                    if (err) {
                        console.error(err);
                    }
                    // Optionally delete the file after sending it
                    fs.unlinkSync('orders.csv');
                });
            })
            .catch(err => {
                console.error(err);
                res.json({ success: false, message: 'Error generating CSV' });
            });
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

