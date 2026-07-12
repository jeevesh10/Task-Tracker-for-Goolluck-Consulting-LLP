import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Layout } from '../components/Layout';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { TaskForm } from '../components/TaskForm';
import { useAuth } from '../context/AuthContext';
import { Task, User, Comment } from '../types';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [error, setError] = useState('');

  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const isAssignedMember = user?.role === 'MEMBER' && task?.assignedToId === user.id;
  const canEdit = isAdminOrManager || isAssignedMember;

  const fetchTask = async () => {
    if (!id) return;
    try {
      const res = await api.tasks.getById(id);
      setTask(res.data);
      if (res.data.comments) {
        setComments(res.data.comments);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      api.users.getAssignees().then((res) => setUsers(res.data)).catch(() => {});
    }
  }, [id]);

  const handleUpdate = async (data: Record<string, unknown>) => {
    if (!id) return;
    try {
      await api.tasks.update(id, data);
      setShowEdit(false);
      fetchTask();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim()) return;
    try {
      const res = await api.comments.create(id, newComment.trim());
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add comment');
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Delete this task?')) return;
    try {
      await api.tasks.delete(id);
      navigate('/tasks');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  if (loading) {
    return (
      <Layout>
        <p className="text-gray-500">Loading...</p>
      </Layout>
    );
  }

  if (error || !task) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Task not found'}</p>
          <button onClick={() => navigate('/tasks')} className="mt-4 text-indigo-600 hover:text-indigo-700">
            ← Back to tasks
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <button onClick={() => navigate('/tasks')} className="text-sm text-indigo-600 hover:text-indigo-700">
          ← Back to tasks
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              <div className="flex gap-2 mt-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <button
                  onClick={() => setShowEdit(true)}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Edit
                </button>
              )}
              {isAdminOrManager && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {task.description && (
            <p className="mt-4 text-gray-600">{task.description}</p>
          )}

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Created By</p>
              <p className="font-medium">{task.createdBy.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Assigned To</p>
              <p className="font-medium">{task.assignedTo?.name || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-gray-500">Due Date</p>
              <p className="font-medium">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Updated</p>
              <p className="font-medium">{new Date(task.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Comments ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm mb-4">No comments yet.</p>
          ) : (
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-l-2 border-indigo-200 pl-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-900">{comment.createdBy.name}</span>
                    <span className="text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.message}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddComment} className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Post
            </button>
          </form>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h2 className="text-lg font-semibold mb-4">
              {isAssignedMember ? 'Update Status' : 'Edit Task'}
            </h2>
            <TaskForm
              task={task}
              users={users}
              isMember={isAssignedMember}
              onSubmit={handleUpdate}
              onCancel={() => setShowEdit(false)}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
