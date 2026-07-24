import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import {
  hasThreeDigits,
  hasUppercase,
  isPasswordValid,
  useAuth,
} from '../../context/AuthContext';
import styles from './ProfilePage.module.scss';

type AuthMode = 'register' | 'login' | 'reset';

const createDemoCode = () => String(Math.floor(1000 + Math.random() * 9000));

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, register, login, logout, hasAccount, resetPassword } = useAuth();
  const [mode, setMode] = useState<AuthMode>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [code, setCode] = useState(['', '', '', '']);
  const [sentCode, setSentCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  const passwordChecks = useMemo(
    () => ({
      uppercase: hasUppercase(password),
      digits: hasThreeDigits(password),
    }),
    [password],
  );

  useEffect(() => {
    setError('');
    if (mode !== 'reset') {
      setInfo('');
    }
  }, [mode]);

  if (user) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.profileCard}>
          <div className={styles.profileCard__avatar}>
            <img src="img/icons/profile.svg" alt="" aria-hidden="true" />
          </div>
          <h1 className={styles.profileCard__name}>{user.name}</h1>
          <p className={styles.profileCard__email}>{user.email}</p>
          <button type="button" className={styles.authButton} onClick={logout}>
            Log out
            <img src="img/icons/Arrow-right-light.svg" alt="" aria-hidden="true" />
          </button>
          <Link to="/store" className={styles.authButtonSecondary}>
            Go to store
            <img src="img/icons/Arrow-right-black.svg" alt="" aria-hidden="true" />
          </Link>
          <Link to="/" className={styles.authButtonSecondary}>
            Main page
            <img src="img/icons/Arrow-right-black.svg" alt="" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  const handleCodeChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 1) {
      const next = [...code];
      digits.slice(0, 4).split('').forEach((digit, offset) => {
        if (index + offset < 4) next[index + offset] = digit;
      });
      setCode(next);
      const focusIndex = Math.min(index + digits.length, 3);
      codeRefs.current[focusIndex]?.focus();
      return;
    }

    const digit = digits.slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 3) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const tryRegister = () => {
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isPasswordValid(password)) {
      setError('Password must contain one uppercase letter and three digits.');
      return;
    }

    const result = register({ name, email, password, notifications });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/');
  };

  const tryLogin = () => {
    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }

    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/');
  };

  const sendResetCode = (again = false) => {
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!hasAccount(email)) {
      setError('No account found with this email.');
      return;
    }

    const nextCode = createDemoCode();
    setSentCode(nextCode);
    setPassword('');
    setCode(['', '', '', '']);
    setError('');
    setInfo(
      again
        ? `A new code was sent. Demo code: ${nextCode}`
        : `A code was sent to your email. Demo code: ${nextCode}`,
    );
    setMode('reset');
    window.setTimeout(() => codeRefs.current[0]?.focus(), 0);
  };

  const tryOpenResetConfirm = () => {
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (code.some((digit) => !digit)) {
      setError('Please enter the 4-digit code.');
      return;
    }
    if (code.join('') !== sentCode) {
      setError('Incorrect code. Please try again.');
      return;
    }
    if (!isPasswordValid(password)) {
      setError('Password must contain one uppercase letter and three digits.');
      return;
    }
    setError('');
    setIsConfirmOpen(true);
  };

  const confirmReset = () => {
    const result = resetPassword(email, password);
    setIsConfirmOpen(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setInfo('Password updated. You can log in now.');
    setPassword('');
    setCode(['', '', '', '']);
    setSentCode('');
    setMode('login');
  };

  const handleCreateClick = () => {
    if (mode === 'register') {
      tryRegister();
      return;
    }
    setMode('register');
  };

  const handleLoginClick = () => {
    if (mode === 'login') {
      tryLogin();
      return;
    }
    if (mode === 'reset') {
      tryOpenResetConfirm();
      return;
    }
    setMode('login');
  };

  const passwordField = (
    <label className={styles.authForm__field}>
      <span>
        {mode === 'reset'
          ? 'Create a new password'
          : mode === 'login'
            ? 'Enter your password'
            : 'Create your password'}
      </span>
      <div className={styles.authForm__passwordWrap}>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
        {!password && (
          <img
            className={styles.authForm__passwordDots}
            src="img/icons/Text.svg"
            alt=""
            aria-hidden="true"
          />
        )}
      </div>
    </label>
  );

  const asideText =
    mode === 'register'
      ? 'Welcome to the world of softness and tranquility. Take the first step — register!'
      : "It's warm here, just like last time. Welcome back!";

  return (
    <div className={styles.profilePage}>
      <div className={styles.authLayout}>
      <form
        className={styles.authForm}
        onSubmit={(event) => {
          event.preventDefault();
          if (mode === 'register') tryRegister();
          if (mode === 'login') tryLogin();
          if (mode === 'reset') tryOpenResetConfirm();
        }}
      >
        {mode === 'register' && (
          <label className={styles.authForm__field}>
            <span>Enter your name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Kateryna"
              autoComplete="name"
            />
          </label>
        )}

        <label className={styles.authForm__field}>
          <span>Enter your email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@gmail.com"
            autoComplete="email"
          />
        </label>

        {mode === 'reset' && (
          <div className={styles.authForm__field}>
            <span>Enter your code</span>
            <div className={styles.authForm__code}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    codeRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  placeholder="0"
                  aria-label={`Code digit ${index + 1}`}
                  onChange={(event) => handleCodeChange(index, event.target.value)}
                  onKeyDown={(event) => handleCodeKeyDown(index, event)}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.authForm__link}
              onClick={() => sendResetCode(true)}
            >
              Send a code again
            </button>
          </div>
        )}

        {(mode === 'login' || mode === 'register' || mode === 'reset') && passwordField}

        {(mode === 'register' || mode === 'reset') && (
          <div className={styles.authForm__rules}>
            <p>Your passcode must contain:</p>
            <ul>
              <li
                className={classNames({
                  [styles['authForm__rule--ok']]: passwordChecks.uppercase,
                })}
              >
                <span className={styles.authForm__ruleIcon} aria-hidden="true">
                  {passwordChecks.uppercase && (
                    <img src="img/icons/checkmark.svg" alt="" />
                  )}
                </span>
                One big letter
              </li>
              <li
                className={classNames({
                  [styles['authForm__rule--ok']]: passwordChecks.digits,
                })}
              >
                <span className={styles.authForm__ruleIcon} aria-hidden="true">
                  {passwordChecks.digits && (
                    <img src="img/icons/checkmark.svg" alt="" />
                  )}
                </span>
                Three digits
              </li>
            </ul>
          </div>
        )}

        {mode === 'login' && (
          <div className={styles.authForm__forgot}>
            <span>Forgot a password?</span>
            <button type="button" onClick={() => sendResetCode(false)}>
              Send a code to email
            </button>
          </div>
        )}

        {mode === 'register' && (
          <div className={styles.authForm__notifications}>
            <span className={styles.authForm__notificationsLine} aria-hidden="true" />
            <label className={styles.authForm__notificationsLabel}>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(event) => setNotifications(event.target.checked)}
              />
              <span>Receive notifications about new products</span>
            </label>
            <span className={styles.authForm__notificationsLine} aria-hidden="true" />
          </div>
        )}

        {error && <p className={styles.authForm__error}>{error}</p>}
        {info && <p className={styles.authForm__info}>{info}</p>}

        {(mode === 'login' || mode === 'reset') && (
          <div
            className={classNames(styles.authForm__dividers, {
              [styles['authForm__dividers--single']]: mode === 'login',
              [styles['authForm__dividers--double']]: mode === 'reset',
            })}
            aria-hidden="true"
          >
            <span />
            {mode === 'reset' && <span />}
          </div>
        )}

        <div className={styles.authForm__actions}>
          {mode === 'register' ? (
            <>
              <button
                type="button"
                className={styles.authButton}
                onClick={handleCreateClick}
              >
                Create an account
                <img src="img/icons/Arrow-right-light.svg" alt="" aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.authButtonSecondary}
                onClick={handleLoginClick}
              >
                Log In
                <img src="img/icons/Arrow-right-black.svg" alt="" aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={styles.authButton}
                onClick={handleLoginClick}
              >
                Log In
                <img src="img/icons/Arrow-right-light.svg" alt="" aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.authButtonSecondary}
                onClick={handleCreateClick}
              >
                Register
                <img src="img/icons/Arrow-right-black.svg" alt="" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </form>

      <aside className={styles.authAside} aria-hidden="true">
        <p className={styles.authAside__text}>{asideText}</p>
        <img
          className={styles.authAside__image}
          src="img/Drowsy-catDesktop.png"
          alt=""
        />
      </aside>
      </div>

      {isConfirmOpen && (
        <div className={styles.confirmModal} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className={styles.confirmModal__backdrop} onClick={() => setIsConfirmOpen(false)} />
          <div className={styles.confirmModal__card}>
            <h2 id="confirm-title">Are you sure?</h2>
            <p>Your old password will be lost.</p>
            <div className={styles.confirmModal__actions}>
              <button type="button" className={styles.confirmModal__yes} onClick={confirmReset}>
                Yes
                <img src="img/icons/iconYes.svg" alt="" aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.confirmModal__no}
                onClick={() => setIsConfirmOpen(false)}
              >
                No
                <img src="img/icons/iconNo.svg" alt="" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
