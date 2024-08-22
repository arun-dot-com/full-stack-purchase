document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (result.success) {
        localStorage.setItem('token', result.token); // Store the token
        window.location.href = '/dashboard.html'; // Redirect to dashboard
    } else {
        alert('Login failed: ' + result.message);
    }
});


document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Mock redirection logic based on role
    switch(role) {
        case 'user':
            window.location.href = '/user/create.html';
            break;
        case 'supervisor':
            window.location.href = '/supervisor/home-sup.html';
            break;
        case 'admin':
            window.location.href = '/admin/admin.html';
            break;
        default:
            alert('Invalid role selected.');
    }
});

// Forgot Password Functionality (Mock Implementation)
document.getElementById('forgotPassword').addEventListener('click', function(event) {
    event.preventDefault();
    // Implement OTP send logic here
    alert('Forgot Password functionality to be implemented.');
});

// First Time User Setup Link (Mock Implementation)
document.querySelector('#firstTimeUser a').addEventListener('click', function(event) {
    event.preventDefault();
    // Implement user setup logic here
    alert('User setup functionality to be implemented.');
});
document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token'); // Retrieve the token

    if (!token) {
        alert('No token found, please log in');
        window.location.href = '/login.html';
        return;
    }

    const response = await fetch('/api/orders', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();
    if (result.success) {
        // Handle displaying the orders
    } else {
        alert('Couldn\'t fetch orders');
        localStorage.removeItem('token'); // Remove the token
        window.location.href = '/index.html';
    }
});

/*

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.success) {
        switch(result.role) {
            case 'user':
                window.location.href = '/user/create.html';
                break;
            case 'supervisor':
                window.location.href = '/supervisor/home-sup.html';
                break;
            case 'admin':
                window.location.href = '/admin/index.html';
                break;
            default:
                alert('Invalid role selected.');
        }
    } else {
        alert('Login failed: ' + result.message);
    }
});

// Forgot Password Functionality (Mock Implementation)
document.getElementById('forgotPassword').addEventListener('click', function(event) {
    event.preventDefault();
    // Implement OTP send logic here
    alert('Forgot Password functionality to be implemented.');
});

// First Time User Setup Link (Mock Implementation)
document.querySelector('#firstTimeUser a').addEventListener('click', function(event) {
    event.preventDefault();
    // Implement user setup logic here
    alert('User setup functionality to be implemented.');
});
*/