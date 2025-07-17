
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
    <main className="p-6 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Google Link Indexing</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border rounded"
          rows="6"
          placeholder="Enter URLs, one per line"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          required
        ></textarea>

        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Task Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useVip}
            onChange={() => setUseVip(!useVip)}
          />
          <span>Add to VIP Queue (max 100 URLs)</span>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Task'}
        </button>
      </form>

      {response && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold">Response</h2>
          <pre className="mt-2 text-sm">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
