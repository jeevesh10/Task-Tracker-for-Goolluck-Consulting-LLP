import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Layout } from '../components/Layout';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { Task } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.tasks.getAll({ limit: 100 })
      .then((res) => setTasks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'TODO').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    done: tasks.filter((t) => t.status === 'DONE').length,
  };

  const recentTasks = tasks.slice(0, 5);

  const roleMessages: Record<string, string> = {
    ADMIN: 'You have full access to manage users and all tasks.',
    MANAGER: 'You can create tasks and assign them to team members.',
    MEMBER: 'View and update tasks assigned to you.',
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name}! {roleMessages[user?.role || 'MEMBER']}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Tasks', value: stats.total, color: 'bg-indigo-50 text-indigo-700' },
            { label: 'To Do', value: stats.todo, color: 'bg-gray-50 text-gray-700' },
            { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-50 text-blue-700' },
            { label: 'Done', value: stats.done, color: 'bg-green-50 text-green-700' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-lg p-5 ${stat.color}`}>
              <p className="text-sm font-medium opacity-80">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
            <Link to="/tasks" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all →
            </Link>
          </div>
          {loading ? (
            <p className="p-6 text-gray-500">Loading...</p>
          ) : recentTasks.length === 0 ? (
            <p className="p-6 text-gray-500">No tasks found.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentTasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      {task.assignedTo?.name || 'Unassigned'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
