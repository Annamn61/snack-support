import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import './login.scss';
import { loginEmailPassword, createUser, signInWithGoogle, guestSignIn } from "../../data/Util/firebaseAuth";
import logo from '../../assets/FF_Logo.svg'
import logo_large from '../../assets/FF_logo_large.svg'

export const Login: React.FC = () => {

    const [signingUp, setSigningUp] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirmPass] = useState('');

    const [error, setError] = useState<undefined | { field: string, message: string }>(undefined);

    const submit = () => {
        if (signingUp) {
            if (password === confirm) {
                createUser(email, password).then(ret => setError(ret));
            } else {
                setError({ field: 'password2', message: 'Passwords do not match' })
            }
        } else {
            loginEmailPassword(email, password).then(ret => setError(ret));
        }
    }

    const emailField = (
        <TextField
            className="login-field"
            value={email}
            type="text"
            variant="outlined"
            placeholder='Email'
            autoFocus={true}
            error={error && (error.field === 'email')}
            // helperText={error && (error.field === 'email') && error.message}
            onChange={(e) => setEmail(e.target.value)}
        />
    );

    const passwordField = (
        <TextField
            className="login-field"
            value={password}
            type="password"
            variant="outlined"
            placeholder='Password'
            error={error && (error.field === 'password')}
            // helperText={error && (error.field === 'password') && error.message}
            autoFocus={true}
            onChange={(e) => setPassword(e.target.value)}
        />
    );

    const confirmPasswordField = (
        <TextField
            className="login-field"
            value={confirm}
            type="password"
            variant="outlined"
            placeholder='Confirm Password'
            autoFocus={true}
            autoComplete="off"
            error={error && (error.field === 'password2')}
            // helperText={error && (error.field === 'password2') && error.message}
            onChange={(e) => setConfirmPass(e.target.value)}
        />
    );

    const actionButton = (
        <button
            disabled={!email || !password}
            className="button-decorative large"
            onClick={submit}
        >
            {signingUp ? 'Sign Up' : 'Sign In'}
        </button>
    );

    const googleButton = (
        <button className="button-secondary-decorative large" onClick={signInWithGoogle}>
            <img src="" alt="google logo" />
            Log in with Google
        </button>
    );

    const guestButton = (
        <button className="button-secondary-decorative large" onClick={guestSignIn}>
            Continue as a guest
        </button>
    );

    const welcomeText = () => {
        const welcome = signingUp ? "We’re glad to have you." : "Welcome back.";
        const subtext = signingUp ? "Create an account to unlock your nutritional potential" : "Sign in to unlock your nutritional potential";
        return (
            <>
                <h2 className="lowercase">{welcome}</h2>
                <p>{subtext}</p>
            </>
        );
    }

    const switchButton = () => {
        const helperText = signingUp ? "Already have an account?" : "Don't have an account?";
        const buttonText = signingUp ? "Sign In" : "Sign Up";
        return (
            <div className="switch-login row">
                <p>{helperText}</p>
                <button className="button-text" onClick={() => setSigningUp(!signingUp)}>{buttonText}</button>
            </div>
        );
    }

    const errorMessage = (
        <div className="error-message">
            <p>{error?.message}</p>
        </div>
    );

    return (
        <div className="login">
            <img className="login-logo" src={logo} alt="food finder logo" />
            <div className="login-container row">
                <div className="login-container-logo row">
                    <img src={logo_large} alt="food finder secondary logo" />
                </div>
                <div>
                    <div className="login-functions col">
                        <div className="login-functions-fields col">
                            {welcomeText()}
                            {emailField}
                            {passwordField}
                            {signingUp && confirmPasswordField}
                            {errorMessage}
                            {actionButton}
                            <div className="row">
                                <div className="login-functions-fields-line" />
                                or
                                <div className="login-functions-fields-line" />
                            </div>
                            {/* {googleButton} */}
                            {guestButton}
                        </div>
                        {switchButton()}
                    </div>
                </div>
            </div>
        </div>
    );
};