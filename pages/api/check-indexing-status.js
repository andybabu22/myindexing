export default async function handler(req, res) {
  const { task_id } = req.body;
  const apiKey = process.env.DEFAULT_API_KEY;

  try {
    const statusRes = await fetch('https://api.speedyindex.com/v2/task/google/checker/status', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task_ids: [task_id] })
    });

    const statusData = await statusRes.json();
    console.log('Status response:', statusData);


    res.status(200).json({
      status: statusData.result ? statusData.result[0] : null
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check status', details: err.message });
  }
}
