
import { useState } from 'react';

export default function CheckIndexing() {
  const [urls, setUrls] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTaskId(null);
    setStatus(null);

    const res = await fetch('/api/check-indexing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        urls: urls.split('\n').map(url => url.trim()).filter(Boolean),
        title: 'Index Check'
      })
    });

    const data = await res.json();
    setTaskId(data.task_id);
    setStatus(data.status || null);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Check Google Indexing
        </h1>

        <form onSubmit={handleCheck} className="space-y-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded"
            rows="6"
            placeholder="Enter URLs to check (one per line)"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            required
          ></textarea>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Submit for Index Check'}
          </button>
        </form>

        {taskId && (
          <div className="mt-6 text-sm text-gray-700">
            <p><strong>Task ID:</strong> {taskId}</p>
            {status && <pre className="mt-2">{JSON.stringify(status, null, 2)}</pre>}
          </div>
        )}
      </div>
    </main>
  );
}
