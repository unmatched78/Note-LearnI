// src/components/Dashboard.tsx
import React, { FC } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

const Dashboard: FC = () => {
  const { user } = useUser();
  const clerk = useClerk();

  const handleSignOut = () => void clerk.signOut();

  return (
    <div className="p-6 bg-green shadow-md rounded-2xl max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">
        Logged in as{' '}
        <span className="font-medium">
          {user?.primaryEmailAddress?.emailAddress}
        </span>
      </p>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
