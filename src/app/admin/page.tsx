'use client';

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          {user?.photoURL && (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'Admin'}
              className="w-10 h-10 rounded-full mr-4"
              width={40}
              height={40}
            />
          )}
          <div>
            <p className="font-medium">{user?.displayName || 'Admin'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <p className="text-gray-700">Welcome to the admin dashboard. This area is restricted to authenticated users only.</p>
      </div>
    </div>
  );
} 