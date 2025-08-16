
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="relative flex-1 w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="background-animation">
          <div className="circle-1"></div>
          <div className="circle-2"></div>
          <div className="circle-3"></div>
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
