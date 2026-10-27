'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'department') {
      document.cookie = 'dept_auth=true; path=/; max-age=604800'; // Sets password for 7 days
      router.push('/');
      router.refresh();
    } else {
      alert('Wrong password! Hint: department');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-black">Department Login</h1>
        <input
          type="password"
          placeholder="Enter password"
          className="w-full border p-2 mb-4 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Enter
        </button>
      </form>
    </div>
  );
}