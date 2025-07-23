import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/auth/RegisterForm';
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
const mockRegister = jest.fn();

describe('RegisterForm', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
    });

    jest.clearAllMocks();
  });

  test('renders register form correctly', () => {
    render(<RegisterForm />);

    expect(screen.getByText('Kayıt Ol')).toBeInTheDocument();
    expect(screen.getByLabelText('Ad')).toBeInTheDocument();
    expect(screen.getByLabelText('Soyad')).toBeInTheDocument();
    expect(screen.getByLabelText('E-posta Adresi')).toBeInTheDocument();
    expect(screen.getByLabelText('Telefon (Opsiyonel)')).toBeInTheDocument();
    expect(screen.getByLabelText('Şifre')).toBeInTheDocument();
    expect(screen.getByLabelText('Şifre Tekrarı')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /kayıt ol/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Ad gereklidir')).toBeInTheDocument();
      expect(screen.getByText('Soyad gereklidir')).toBeInTheDocument();
      expect(screen.getByText('E-posta adresi gereklidir')).toBeInTheDocument();
      expect(screen.getByText('Şifre gereklidir')).toBeInTheDocument();
      expect(screen.getByText('Şifre tekrarı gereklidir')).toBeInTheDocument();
    });
  });

  test('shows validation error for short names', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const firstNameInput = screen.getByLabelText('Ad');
    const lastNameInput = screen.getByLabelText('Soyad');
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });

    await user.type(firstNameInput, 'A');
    await user.type(lastNameInput, 'B');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Ad en az 2 karakter olmalıdır')).toBeInTheDocument();
      expect(screen.getByText('Soyad en az 2 karakter olmalıdır')).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText('E-posta Adresi');
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Geçerli bir e-posta adresi giriniz')).toBeInTheDocument();
    });
  });

  test('shows validation error for weak password', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText('Şifre');
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });

    await user.type(passwordInput, 'weak');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Şifre en az 8 karakter olmalıdır')).toBeInTheDocument();
    });
  });

  test('shows validation error for password without required characters', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText('Şifre');
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });

    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Şifre en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir')).toBeInTheDocument();
    });
  });

  test('shows validation error for mismatched passwords', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText('Şifre');
    const confirmPasswordInput = screen.getByLabelText('Şifre Tekrarı');
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });

    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Password456');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Şifreler eşleşmiyor')).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid phone number', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const phoneInput = screen.getByLabelText('Telefon (Opsiyonel)');
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });

    await user.type(phoneInput, '123456');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Geçerli bir telefon numarası giriniz')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue(true);

    render(<RegisterForm />);

    await user.type(screen.getByLabelText('Ad'), 'Test');
    await user.type(screen.getByLabelText('Soyad'), 'User');
    await user.type(screen.getByLabelText('E-posta Adresi'), 'test@example.com');
    await user.type(screen.getByLabelText('Telefon (Opsiyonel)'), '05551234567');
    await user.type(screen.getByLabelText('Şifre'), 'Password123');
    await user.type(screen.getByLabelText('Şifre Tekrarı'), 'Password123');
    
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '05551234567',
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('shows error message for failed registration', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue(false);

    render(<RegisterForm />);

    await user.type(screen.getByLabelText('Ad'), 'Test');
    await user.type(screen.getByLabelText('Soyad'), 'User');
    await user.type(screen.getByLabelText('E-posta Adresi'), 'existing@example.com');
    await user.type(screen.getByLabelText('Şifre'), 'Password123');
    await user.type(screen.getByLabelText('Şifre Tekrarı'), 'Password123');
    
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Kayıt işlemi başarısız. Bu e-posta adresi zaten kullanılıyor olabilir.')).toBeInTheDocument();
    });
  });
});