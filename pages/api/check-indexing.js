
export default async function handler(req, res) {
  const { urls, title } = req.body;
  const apiKey = process.env.DEFAULT_API_KEY;

  try {
    const taskRes = await fetch('https://api.speedyindex.com/v2/task/google/checker/create', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, urls })
    });

    const taskData = await taskRes.json();

    if (taskData.code !== 0) {
      return res.status(400).json({ error: 'Task creation failed', details: taskData });
    }

    const statusRes = await fetch('https://api.speedyindex.com/v2/task/google/checker/status', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task_ids: [taskData.task_id] })
    });

    const statusData = await statusRes.json();

    res.status(200).json({
      task_id: taskData.task_id,
      status: statusData.result ? statusData.result[0] : null
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
