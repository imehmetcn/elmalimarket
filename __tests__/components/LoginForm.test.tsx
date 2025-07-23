import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockPush = jest.fn();
const mockLogin = jest.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });

    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(<LoginForm />);

    expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
    expect(screen.getByLabelText('E-posta Adresi')).toBeInTheDocument();
    expect(screen.getByLabelText('Şifre')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /giriş yap/i })).toBeInTheDocument();
    expect(screen.getByText('Hesabınız yok mu?')).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /giriş yap/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('E-posta adresi gereklidir')).toBeInTheDocument();
      expect(screen.getByText('Şifre gereklidir')).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('E-posta Adresi');
    const submitButton = screen.getByRole('button', { name: /giriş yap/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Geçerli bir e-posta adresi giriniz')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(true);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('E-posta Adresi');
    const passwordInput = screen.getByLabelText('Şifre');
    const submitButton = screen.getByRole('button', { name: /giriş yap/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('shows error message for failed login', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(false);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('E-posta Adresi');
    const passwordInput = screen.getByLabelText('Şifre');
    const submitButton = screen.getByRole('button', { name: /giriş yap/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('E-posta veya şifre hatalı')).toBeInTheDocument();
    });
  });

  test('shows loading state during submission', async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 100)));

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('E-posta Adresi');
    const passwordInput = screen.getByLabelText('Şifre');
    const submitButton = screen.getByRole('button', { name: /giriş yap/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByText('Giriş yapılıyor...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('displays test account information', () => {
    render(<LoginForm />);

    expect(screen.getByText('Test hesapları:')).toBeInTheDocument();
    expect(screen.getByText('Admin: admin@elmalimarket.com / admin123')).toBeInTheDocument();
    expect(screen.getByText('Müşteri: musteri@example.com / customer123')).toBeInTheDocument();
  });
});