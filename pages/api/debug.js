export default async function handler(req, res) {
  const apiKey = process.env.DEFAULT_API_KEY;
  const task_id = "YOUR_TASK_ID_HERE"; // Use latest one from the frontend

  const response = await fetch('https://api.speedyindex.com/v2/task/google/checker/status', {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ task_ids: [task_id] })
  });

  const data = await response.json();
  res.status(200).json(data);
}
