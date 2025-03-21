'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';

export default function GoogleSignInButton() {
  const { user, signIn, signOut } = useAuth();

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-2">
          {user.photoURL && (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.displayName || 'User'}</span>
            <button
              onClick={signOut}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={signIn}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FcGoogle className="w-5 h-5" />
          Sign in with Google
        </button>
      )}
    </div>
  );
} 