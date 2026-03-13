(function () {
    const TOKEN_KEY = 'sc_token';
    const USER_KEY = 'sc_user';

    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
        } catch (error) {
            return null;
        }
    }

    function setSession(token, user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    function clearSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    function getAuthHeaders(extraHeaders = {}) {
        const token = getToken();
        return {
            ...extraHeaders,
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        };
    }

    async function fetchMe() {
        const token = getToken();
        if (!token) {
            return null;
        }

        try {
            const response = await fetch('/api/auth/me', {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                clearSession();
                return null;
            }

            const result = await response.json();
            if (!result.success || !result.user) {
                clearSession();
                return null;
            }

            localStorage.setItem(USER_KEY, JSON.stringify(result.user));
            return result.user;
        } catch (error) {
            clearSession();
            return null;
        }
    }

    function redirectByRole(user) {
        if (!user) {
            window.location.href = '/auth.html';
            return;
        }

        if (user.role === 'admin') {
            window.location.href = '/index.html';
            return;
        }

        window.location.href = '/booking.html';
    }

    async function requireRole(role) {
        const user = await fetchMe();
        if (!user) {
            window.location.href = '/auth.html';
            return null;
        }

        if (role && user.role !== role) {
            redirectByRole(user);
            return null;
        }

        return user;
    }

    function logout() {
        clearSession();
        window.location.href = '/auth.html';
    }

    window.Auth = {
        getToken,
        getUser,
        setSession,
        clearSession,
        getAuthHeaders,
        fetchMe,
        requireRole,
        redirectByRole,
        logout
    };
})();
