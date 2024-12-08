const API_BASE_URL = 'http://localhost:5171/api';

// Utility functions
function validatePasswords() {
    const password = document.getElementById('Password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    return password === confirmPassword;
}

function getFormValue(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with id '${id}' not found`);
        return '';
    }
    return element.value;
}

// Handle signup form submission
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
        showError('Passwords do not match!');
        return;
    }

    if (!document.getElementById('terms').checked) {
        showError('Please accept the Terms of Service');
        return;
    }

    const accountType = getFormValue('accountType');
    if (!accountType) {
        showError('Please select an account type');
        return;
    }

    let endpoint;
    let formData;

    // Format data based on account type
    if (accountType === 'trainee') {
        formData = {
            CustomerID: Math.floor(Math.random() * 1000000),
            Username: document.getElementById('Username').value,
            Email: document.getElementById('Email').value,
            Password: document.getElementById('Password').value,
            FName: document.getElementById('FName').value,
            LName: document.getElementById('LName').value,
            Phone: document.getElementById('Phone').value,
            WorkoutPreference: document.getElementById('workoutPreference').value,
            AccountType: 'Trainee'  // Added this field
        };
        endpoint = 'Trainee';
    } else {
        formData = {
            TrainerID: Math.floor(Math.random() * 1000000),
            Username: document.getElementById('Username').value,
            Email: document.getElementById('Email').value,
            Password: document.getElementById('Password').value,
            FName: document.getElementById('FName').value,
            LName: document.getElementById('LName').value,
            Phone: document.getElementById('Phone').value,
            SpecialityGroup: document.getElementById('workoutPreference').value, // Changed from Specialty to SpecialityGroup
            AcceptanceStatus: 1,
            AccountType: 'Trainer'  // Added this field
        };
        endpoint = 'Trainer';
    }

    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating Account...';

    try {
        console.log('Sending data:', formData);
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Error:', errorData); // Debug log
            throw new Error(`Signup failed: ${errorData}`);
        }

        showSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
            window.location.href = 'login.html?registered=true';
        }, 2000);
    } catch (error) {
        console.error('Error:', error); // Debug log
        showError(error.message);
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const identifier = document.getElementById('loginIdentifier').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    try {
        // Determine API endpoint based on role
        const endpoint = role === 'trainer' ? 'Trainer' : 'Trainee';
        
        // Get all users of selected type
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        const users = await response.json();
        console.log('Users:', users);

        // Find matching user
        const user = users.find(u => 
            (u.email.toLowerCase() === identifier.toLowerCase() || 
             u.username.toLowerCase() === identifier.toLowerCase()) && 
            u.password === password
        );


        if (user) {
            // Store user data
            localStorage.setItem('userId', role === 'trainer' ? user.TrainerID : user.CustomerID);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userEmail', user.Email);
            localStorage.setItem('userName', user.Username);

            // Redirect based on role
            window.location.href = `${role}.html`;
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        showError(error.message);
    }
});

function showError(message) {
    const errorDiv = document.getElementById('auth-error') || document.createElement('div');
    errorDiv.id = 'auth-error';
    errorDiv.className = 'alert alert-danger mt-3';
    errorDiv.textContent = message;
    
    insertAlert(errorDiv);
}

function showSuccess(message) {
    const successDiv = document.getElementById('auth-success') || document.createElement('div');
    successDiv.id = 'auth-success';
    successDiv.className = 'alert alert-success mt-3';
    successDiv.textContent = message;
    
    insertAlert(successDiv);
}

function insertAlert(alertDiv) {
    const form = document.querySelector('form');
    if (!document.getElementById(alertDiv.id)) {
        form.insertAdjacentElement('beforebegin', alertDiv);
    }
}

// Check auth status on protected pages
function checkAuth() {
    const protectedPages = ['admin.html', 'trainer.html', 'trainee.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('userRole');
        
        if (!userId || !userRole) {
            window.location.href = 'login.html';
            return;
        }

        // Verify correct role for page
        const pageRole = currentPage.replace('.html', '');
        if (pageRole !== userRole) {
            window.location.href = `${userRole}.html`;
        }
    }
}

// Run auth check on page load
checkAuth();

// Handle logout
document.querySelector('.btn-brand')?.addEventListener('click', (e) => {
    if (e.target.textContent === 'Logout') {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '../index.html';
    }
});