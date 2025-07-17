
import { useState } from 'react';

export default function Home() {
  const [urls, setUrls] = useState('');
  const [title, setTitle] = useState('');
  const [useVip, setUseVip] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const res = await fetch('/api/submit-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        urls: urls.split('\n').map(url => url.trim()).filter(Boolean),
        title,
        useVip
      })
    });

    const data = await res.json();
    setResponse(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Google Link Indexing Tool
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              URLs (one per line)
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-400"
              rows="6"
              placeholder="https://example.com/page1\nhttps://example.com/page2"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Task Title (optional)
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-400"
              type="text"
              placeholder="My Indexing Task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={useVip}
              onChange={() => setUseVip(!useVip)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Add to VIP Queue (max 100 URLs)</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Submitting...' : 'Submit Task'}
          </button>
        </form>

        {response && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Response</h2>
            <pre className="text-sm overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
