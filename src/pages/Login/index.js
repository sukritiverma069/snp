import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Login.css'
import { loginUser } from '../../services/authService'
import { useAuth } from '../../stores'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error, authActions, userActions } = useAuth();
    
    const from = location.state?.from?.pathname || '/dashboard';


    const validateInputs = () => {
        let isValid = true;
        setUsernameError('');
        setPasswordError('');
        authActions.clearError();
        userActions.clearError();

        if (!username.trim()) {
            setUsernameError('Username is required');
            isValid = false;
        }

        if (!password.trim()) {
            setPasswordError('Password is required');
            isValid = false;
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (!validateInputs()) {
            return;
        }

        try {
            authActions.setLoading(true);
            const loginData = await loginUser(username, password);
            await login(loginData);           
            navigate(from, { replace: true });

        } catch (error) {
            console.error('Authentication failed:', error);
            authActions.setError(error.message);
        } finally {
            authActions.setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <h1 className="login-title">Welcome Back</h1>
                <div className="form-group">
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`form-input ${usernameError ? 'error' : ''}`}
                        required
                    />
                    {usernameError && <span className="field-error">{usernameError}</span>}
                </div>
                <div className="form-group">
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`form-input ${passwordError ? 'error' : ''}`}
                        required
                    />
                    {passwordError && <span className="field-error">{passwordError}</span>}
                </div>
                <button
                    onClick={handleLogin}
                    className="login-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    )
}

export default Login