document.addEventListener('DOMContentLoaded', async () => {
    initAuthAIAssistant();

    const existing = await window.Auth.fetchMe();
    if (existing) {
        window.Auth.redirectByRole(existing);
        return;
    }

    const modeLogin = document.getElementById('modeLogin');
    const modeRegister = document.getElementById('modeRegister');
    const authForm = document.getElementById('authForm');
    const forgotPasswordToggle = document.getElementById('forgotPasswordToggle');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');

    modeLogin.addEventListener('click', () => updateAuthMode('login'));
    modeRegister.addEventListener('click', () => updateAuthMode('register'));
    authForm.addEventListener('submit', handleAuthSubmit);
    forgotPasswordToggle.addEventListener('click', toggleForgotPassword);
    forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    resetPasswordForm.addEventListener('submit', handleResetPassword);

    updateAuthMode('login');
});

function initAuthAIAssistant() {
    const tipElement = document.getElementById('authAITip');
    if (!tipElement) {
        return;
    }

    const tips = [
        'Use your registered email and password for quick secure access.',
        'Switch to register mode to create your canteen profile in one step.',
        'Forgot password uses phone OTP only, no email dependency.'
    ];

    let tipIndex = 0;
    setInterval(() => {
        tipIndex = (tipIndex + 1) % tips.length;
        tipElement.textContent = tips[tipIndex];
    }, 3500);
}

function updateAuthMode(mode) {
    const isRegister = mode === 'register';
    const title = document.getElementById('authTitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const modeLogin = document.getElementById('modeLogin');
    const modeRegister = document.getElementById('modeRegister');

    window.currentAuthMode = mode;

    modeLogin.classList.toggle('active', !isRegister);
    modeRegister.classList.toggle('active', isRegister);

    document.querySelectorAll('.register-only').forEach(el => {
        el.style.display = isRegister ? 'block' : 'none';
    });

    document.querySelectorAll('.login-only').forEach(el => {
        el.style.display = isRegister ? 'none' : 'flex';
    });

    if (isRegister) {
        document.getElementById('forgotPasswordPanel').style.display = 'none';
    }

    title.textContent = isRegister ? 'Register' : 'Login';
    submitBtn.textContent = isRegister ? 'Register' : 'Login';

    document.getElementById('authUserId').required = isRegister;
    document.getElementById('authName').required = isRegister;
    document.getElementById('authEmail').required = isRegister;
    document.getElementById('authPhone').required = isRegister;
}

function toggleForgotPassword() {
    const panel = document.getElementById('forgotPasswordPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

async function handleForgotPassword(e) {
    e.preventDefault();

    const phone = document.getElementById('forgotPhone').value.trim();
    const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
    });

    const result = await response.json();
    if (!response.ok) {
        alert(result.error || 'Failed to generate OTP');
        return;
    }

    if (result.devResetCode) {
        alert(`Your password reset OTP is: ${result.devResetCode}`);
        document.getElementById('resetCode').value = result.devResetCode;
    } else {
        alert('OTP generated successfully');
    }
}

async function handleResetPassword(e) {
    e.preventDefault();

    const phone = document.getElementById('forgotPhone').value.trim();
    const code = document.getElementById('resetCode').value.trim();
    const newPassword = document.getElementById('newPassword').value;

    const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, newPassword })
    });

    const result = await response.json();
    if (!response.ok) {
        alert(result.error || 'Failed to reset password');
        return;
    }

    alert('Password reset successful. Please login now.');
    document.getElementById('forgotPasswordPanel').style.display = 'none';
    document.getElementById('authEmail').value = '';
    document.getElementById('authPassword').value = '';
}

async function handleAuthSubmit(e) {
    e.preventDefault();

    const mode = window.currentAuthMode || 'login';
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;

    if (mode === 'login') {
        const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const loginResult = await loginRes.json();
        if (!loginRes.ok) {
            alert(loginResult.error || 'Login failed');
            return;
        }

        window.Auth.setSession(loginResult.token, loginResult.user);
        window.Auth.redirectByRole(loginResult.user);
        return;
    }

    const payload = {
        userId: document.getElementById('authUserId').value.trim(),
        name: document.getElementById('authName').value.trim(),
        email,
        phone: document.getElementById('authPhone').value.trim(),
        password
    };

    const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const registerResult = await registerRes.json();
    if (!registerRes.ok) {
        alert(registerResult.error || 'Registration failed');
        return;
    }

    alert('Registration successful. Please login now.');
    updateAuthMode('login');
    document.getElementById('authEmail').value = email;
    document.getElementById('authPassword').value = '';
}
