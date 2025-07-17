
import { useState, useEffect } from 'react';

export default function CheckIndexing() {
  const [urls, setUrls] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setTaskId(null);

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

  // Poll every 5 seconds to update status
  useEffect(() => {
    if (!taskId) return;
    const interval = setInterval(async () => {
      const res = await fetch('/api/check-indexing-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
      });
      const data = await res.json();
      if (data.status?.status === 'completed') {
        setStatus(data.status);
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [taskId]);

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
          </div>
        )}

        {status?.result && (
          <div className="mt-6 space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Indexing Results:</h2>
            {status.result.map((item, idx) => (
              <div
                key={idx}
                className={\`p-3 rounded border \${item.indexed
                  ? 'bg-green-100 border-green-400 text-green-800'
                  : 'bg-red-100 border-red-400 text-red-800'}\`}
              >
                <p className="text-sm">
                  <strong>{item.url}</strong>: {item.indexed ? '✅ Indexed' : '❌ Not Indexed'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
