'use client';

import { useEffect, useState } from 'react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<unknown[]>([]);

  useEffect(() => {
    async function getTasks() {
      try {
        const token = sessionStorage.getItem('access_token');

        if (!token) {
          alert('Please log in first!');
          return;
        }

        const response = await fetch('http://localhost:3000/tasks', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();

        console.log('Tasks from backend:', data);
        setTasks(data);

      } catch (error) {
        console.error('Unable to fetch tasks:', error);
      }
    }

    getTasks();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900">
        My Tasks
      </h1>

      <p className="mt-2 text-gray-600">
        You have {tasks.length} tasks.
      </p>
    </main>
  );
}
