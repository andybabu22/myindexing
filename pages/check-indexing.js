import { useState, useEffect } from 'react';

export default function CheckIndexing() {
  const [urls, setUrls] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult([]);
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
    setLoading(false);
  };

  useEffect(() => {
    if (!taskId) return;
    const interval = setInterval(async () => {
      const res = await fetch('/api/check-indexing-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
      });

      const data = await res.json();
      if (Array.isArray(data.result) && data.result.length > 0) {
        setResult(data.result);
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [taskId]);

  const downloadCSV = () => {
    if (!result.length) return;
    const csv = 'URL,Indexed\n' + result.map(r => `${r.url},${r.indexed}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'indexing-results.csv';
    a.click();
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow rounded p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Google Index Checker</h1>
        <form onSubmit={handleCheck} className="space-y-4">
          <textarea
            className="w-full border p-2 rounded"
            rows="6"
            placeholder="Enter one URL per line"
            value={urls}
            onChange={e => setUrls(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Submit'}
          </button>
        </form>

        {taskId && !result.length && (
          <p className="mt-4 text-center text-sm text-gray-600">⏳ Waiting for indexing results...</p>
        )}

        {result.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Results</h2>
              <button onClick={downloadCSV} className="bg-blue-600 text-white text-sm px-3 py-1 rounded">
                Download CSV
              </button>
            </div>
            <ul className="space-y-2">
              {result.map((item, i) => (
                <li key={i} className={`p-3 rounded border ${item.indexed ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
                  <strong>{item.url}</strong>: {item.indexed ? '✅ Indexed' : '❌ Not Indexed'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
