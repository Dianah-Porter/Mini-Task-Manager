
'use client';

import { useEffect, useState } from 'react';

interface Task {
  id?: number | string;
  title: string;
  description: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  //editing states 
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // 1. Fetch existing tasks when the page opens
  useEffect(() => {
    async function getTasks() {
      try {
        const token = sessionStorage.getItem('access_token');

        if (!token) {
          setError('Please log in first.');
          return;
        }

        const response = await fetch('http://localhost:3000/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Unable to load tasks.');
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Unable to fetch tasks:', error);
        setError('Could not load tasks. Please try again.');
      }
    }

    getTasks();
  }, []);

  // 2. Create a new task
  async function handleCreateTask(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = sessionStorage.getItem('access_token');

      if (!token) {
        throw new Error('Please log in first.');
      }

      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Failed to create task.',
        );
      }

      // 3. Add the saved task to the displayed list
      setTasks((previousTasks) => [data, ...previousTasks]);

      // 4. Clear the form
      setTitle('');
      setDescription('');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong.';

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  //editing functions 
  function startEditing(task: Task) {
  if (task.id === undefined) {
    setError('This task has no ID.');
    return;
  }

  setEditingId(task.id);
  setEditTitle(task.title);
  setEditDescription(task.description);
  setError('');
}

async function saveTask(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (editingId === null) return;

  try {
    setError('');

    const token = sessionStorage.getItem('access_token');

    if (!token) {
      throw new Error('Please log in first.');
    }

    const response = await fetch(
      `http://localhost:3000/tasks/${editingId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Failed to update task.',
      );
    }

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === editingId ? data : task,
      ),
    );

    setEditingId(null);
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : 'Something went wrong.',
    );
  }
}

//delete function

async function deleteTask(id: number | string | undefined) {
  if (id === undefined) {
    setError('Cannot delete a task without an ID.');
    return;
  }

  const confirmed = window.confirm(
    'Are you sure you want to delete this task?',
  );

  if (!confirmed) return;

  try {
    setError('');

    const token = sessionStorage.getItem('access_token');

    if (!token) {
      throw new Error('Please log in first.');
    }

    const response = await fetch(
      `http://localhost:3000/tasks/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || 'Failed to delete task.',
      );
    }

    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id),
    );

    if (editingId === id) {
      setEditingId(null);
    }
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : 'Something went wrong.',
    );
  }
}


  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900">
          My Tasks
        </h1>

        <p className="mt-2 text-gray-600">
          You have {tasks.length} tasks.
        </p>

        <form
          onSubmit={handleCreateTask}
          className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow"
        >
          <h2 className="text-xl font-semibold">Create a new task</h2>

          <div>
            <label
              htmlFor="title"
              className="mb-1 block font-medium"
            >
              Task title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Learn NestJS"
              required
              className="w-full rounded-md border border-gray-300 p-3"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe what you need to do"
              required
              rows={3}
              className="w-full rounded-md border border-gray-300 p-3"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </form>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Your tasks</h2>

          {tasks.length === 0 ? (
            <p className="text-gray-500">
              No tasks yet. Create your first task above.
            </p>
          ) : (
            tasks.map((task, index) => (
  <article
    key={task.id ?? index}
    className="rounded-lg border border-gray-200 bg-white p-4"
  >
    {editingId === task.id ? (
      <form onSubmit={saveTask} className="space-y-3">
        <input
          value={editTitle}
          onChange={(event) => setEditTitle(event.target.value)}
          required
          className="w-full rounded-md border p-2"
          placeholder="Task title"
        />

        <textarea
          value={editDescription}
          onChange={(event) =>
            setEditDescription(event.target.value)
          }
          required
          rows={3}
          className="w-full rounded-md border p-2"
          placeholder="Task description"
        />

        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => setEditingId(null)}
          className="ml-2 rounded-md border px-4 py-2"
        >
          Cancel
        </button>
      </form>
    ) : (
      <>
        <h3 className="font-semibold text-gray-900">
          {task.title}
        </h3>

        <p className="mt-1 text-gray-600">
          {task.description}
        </p>

        <button
          type="button"
          onClick={() => startEditing(task)}
          className="mt-3 rounded-md bg-gray-200 px-4 py-2"
        >
          Edit
        </button>
        
<button
  type="button"
  onClick={() => deleteTask(task.id)}
  className="ml-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
>
  Delete
</button>

      </>
    )}
  </article>
))
          )}
        </section>
      </div>
    </main>
  );
}
