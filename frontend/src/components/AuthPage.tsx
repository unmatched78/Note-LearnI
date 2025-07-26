// AuthPage.tsx
import { FC } from 'react';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';

type AuthMode = 'sign-in' | 'sign-up';
interface AuthPageProps {
  mode: AuthMode;
}

const AuthPage: FC<AuthPageProps> = ({ mode }) => {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.firstName}!</h2>
        <p>You are signed in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        {mode === 'sign-up' ? (
          <SignUp
            appearance={{
              elements: { formButtonPrimary: 'bg-blue-600 hover:bg-blue-700' }
            }}
          />
        ) : (
          <SignIn
            appearance={{
              elements: { formButtonPrimary: 'bg-green-600 hover:bg-green-700' }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;