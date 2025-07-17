
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { apiKey: userKey, urls, title, useVip } = req.body;
  const apiKey = userKey || process.env.DEFAULT_API_KEY;

  try {
    const createTask = await fetch('https://api.speedyindex.com/v2/task/google/indexer/create', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, urls })
    });

    const taskData = await createTask.json();
    if (taskData.code !== 0) {
      return res.status(400).json({ error: 'Task creation failed', taskData });
    }

    let vipResult = null;
    if (useVip && urls.length <= 100) {
      const vipReq = await fetch('https://api.speedyindex.com/v2/task/google/indexer/vip', {
        method: 'POST',
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task_id: taskData.task_id })
      });

      vipResult = await vipReq.json();
    }

    res.status(200).json({
      message: 'Task created successfully',
      task_id: taskData.task_id,
      vip: vipResult || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
