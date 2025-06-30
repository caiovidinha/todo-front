'use client';

import { useEffect, useState } from 'react';
import { api } from '../../utils/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      const data = await api('/tasks/');
      data.sort((a, b) => a.is_done - b.is_done);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async () => {
    try {
      await api('/tasks/', {
        method: 'POST',
        body: JSON.stringify({ title, description }),
      });
      setTitle('');
      setDescription('');
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api(`/tasks/${id}`, { method: 'DELETE' });
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleDone = async (task) => {
    try {
      await api(`/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_done: !task.is_done }),
      });
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main className='px-[550px] flex flex-col w-full h-screen items-center justify-center'>
      <div className='flex flex-col w-full items-center justify-center gap-5 bg-gray-100 p-8 rounded-2xl border-solid border-2'>
        <h1 className='text-2xl text-black'>Tarefas</h1>

        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='text-black bg-gray-300 p-2 rounded-lg w-full'
        />
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='text-black bg-gray-300 p-2 rounded-lg w-full'
        />
        <button onClick={handleCreate} className='p-4 bg-green-600 w-full rounded-lg hover:cursor-pointer hover:bg-green-800'>
          Criar
        </button>

        <hr className="w-full border-t-2 border-gray-300 my-4" />

        {error && <p className='text-red-600'>{error}</p>}
        {tasks.length === 0 && (
  <p className="text-gray-500 italic mt-4">Não há tarefas</p>
)}
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex bg-white w-full p-6 border-2 border-black rounded-lg justify-between items-center transition-all ${
              task.is_done ? 'text-gray-400 line-through bg-gray-100' : 'text-black'
            }`}
          >
            <div className='flex items-center gap-3'>
              <div>
                <strong>{task.title}</strong>
                <p className='text-sm'>{task.description}</p>
              </div>
            </div>
            <div className='flex items-end gap-2'>
            <input
                type="checkbox"
                checked={task.is_done}
                onChange={() => handleToggleDone(task)}
                className="w-5 h-5 accent-green-600 hover:cursor-pointer"
            />
            <button onClick={() => handleDelete(task.id)} title="Deletar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600 hover:text-red-800 transition-colors hover:cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
            
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7L5 7M10 11v6m4-6v6M4 7h16M6 7l1 12h10l1-12" />
              </svg>
            </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
