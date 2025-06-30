'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken } from '../utils/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await api('/users/', {
        method: 'POST',
        body: JSON.stringify({ username }),
      });

      setToken(res.access_token);
      router.push('/tasks');
    } catch (err) {
      setError(err.message || 'Erro ao autenticar');
    }
  };

  return (
    <main className='px-[550px] flex flex-col w-full h-screen items-center justify-center'>
      <div className='flex flex-col w-full items-center justify-center gap-5 bg-gray-100 p-8 rounded-2xl border-solid border-2'>
      <h1 className='text-2xl text-black'>Criar usuário e fazer login</h1>
      <input
        type="text"
        value={username}
        placeholder="Usuário"
        onChange={(e) => setUsername(e.target.value)}
        className='text-black bg-gray-300 p-2 rounded-lg w-full'
      />
      <button onClick={handleLogin} className='p-4 bg-green-600 w-full rounded-lg hover:cursor-pointer hover:bg-green-800'>
        Entrar
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </main>
  );
}
  