import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Layout } from '../components/Layout';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { TaskForm } from '../components/TaskForm';
import { useAuth } from '../context/AuthContext';
import { Task, User, TaskStatus, Priority, TaskFilters } from '../types';

export function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 10 });
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [error, setError] = useState('');

  const canCreate = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.tasks.getAll(filters);
      setTasks(res.data);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  useEffect(() => {
    if (canCreate) {
      api.users.getAssignees().then((res) => setUsers(res.data)).catch(() => {});
    }
  }, [canCreate]);

  const handleCreate = async (data: Record<string, unknown>) => {
    try {
      await api.tasks.create(data);
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.tasks.delete(id);
      fetchTasks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          {canCreate && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
            >
              + Create Task
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={filters.status || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: (e.target.value as TaskStatus) || undefined,
                  page: 1,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Statuses</option>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
            <select
              value={filters.priority || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priority: (e.target.value as Priority) || undefined,
                  page: 1,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
              <select
                value={filters.assignedToId || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    assignedToId: e.target.value || undefined,
                    page: 1,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Assignees</option>
                {users
                  .filter((u) => u.role === 'MEMBER')
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
              </select>
            )}
            <button
              onClick={() => setFilters({ page: 1, limit: 10 })}
              className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <p className="p-6 text-gray-500">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="p-6 text-gray-500">No tasks found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link to={`/tasks/${task.id}`} className="font-medium text-indigo-600 hover:text-indigo-700">
                        {task.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4"><PriorityBadge priority={task.priority} /></td>
                    <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{task.assignedTo?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/tasks/${task.id}`} className="text-sm text-indigo-600 hover:text-indigo-700 mr-3">
                        View
                      </Link>
                      {canCreate && (
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {meta.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
            <TaskForm
              users={users}
              onSubmit={handleCreate}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
