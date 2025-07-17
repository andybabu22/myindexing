export default function handler(req, res) {
  const { username, password } = req.body;
  const valid =
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD;

  if (valid) {
    res.setHeader('Set-Cookie', 'auth=true; Path=/; HttpOnly; SameSite=Lax');
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
}
