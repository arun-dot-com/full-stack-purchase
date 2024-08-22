document.addEventListener('DOMContentLoaded', async () => {
    await fetchAndDisplayOrders();
});

async function fetchAndDisplayOrders() {
    try {
        const response = await fetch('/api/orders');
        const result = await response.json();

        if (result.success) {
            displayOrders(result.orders);
        } else {
            showAlert('error', 'Failed to fetch orders');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('error', 'An error occurred while fetching orders');
    }
}

function displayOrders(orders) {
    const ordersTable = document.getElementById('ordersTableBody');
    ordersTable.innerHTML = ''; // Clear existing orders

    orders.forEach(order => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = order.orderId;
        row.appendChild(idCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = order.productName;
        row.appendChild(nameCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = order.quantity;
        row.appendChild(quantityCell);

        const modifyCell = document.createElement('td');
        const modifyButton = document.createElement('button');
        modifyButton.textContent = 'Modify';
        modifyButton.onclick = () => showModifyOrderForm(order);
        modifyCell.appendChild(modifyButton);
        row.appendChild(modifyCell);

        ordersTable.appendChild(row);
    });
}

function showModifyOrderForm(order) {
    document.getElementById('modifyOrderId').value = order.orderId;
    document.getElementById('modifyProductName').value = order.productName;
    document.getElementById('modifyQuantity').value = order.quantity;
    document.getElementById('modifyOrderForm').style.display = 'block';
}

document.getElementById('modifyOrderForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const orderId = document.getElementById('modifyOrderId').value;
    const productName = document.getElementById('modifyProductName').value;
    const quantity = document.getElementById('modifyQuantity').value;

    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productName, quantity })
        });

        const result = await response.json();

        if (result.success) {
            showAlert('success', 'Order modified successfully');
            document.getElementById('modifyOrderForm').style.display = 'none';
            fetchAndDisplayOrders(); // Refresh the orders list
        } else {
            showAlert('error', 'Failed to modify order: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('error', 'An error occurred while modifying the order');
    }
});

function showAlert(type, message) {
    const alertBox = document.getElementById('responseMessage');
    alertBox.textContent = message;
    alertBox.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    alertBox.style.color = type === 'success' ? '#155724' : '#721c24';
}
