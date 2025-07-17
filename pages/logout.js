export default function Logout() {
  if (typeof window !== 'undefined') {
    fetch('/api/logout').then(() => {
      window.location.href = '/login';
    });
  }
  return null;
}
