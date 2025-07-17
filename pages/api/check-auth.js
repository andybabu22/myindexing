export default function handler(req, res) {
  const isAuth = req.cookies?.auth === 'true';
  res.status(200).json({ authenticated: isAuth });
}
