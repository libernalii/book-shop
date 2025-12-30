import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import "../../styles/auth.scss"

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    setLoading(true);
    try {
      // Відправляємо тільки поля, які є в схемі: fullName, email, password
      await register({ fullName, email, password });
      navigate('/');
    } catch (err) {
      console.log(err.response?.data); // щоб бачити точну помилку від сервера
      setError(err.response?.data?.error || 'Помилка реєстрації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <h1>Реєстрація</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="ПІБ"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Повторіть пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Реєстрація...' : 'Зареєструватися'}
        </button>
      </form>

      <p>
        Вже є акаунт? <Link to="/login">Увійти</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
