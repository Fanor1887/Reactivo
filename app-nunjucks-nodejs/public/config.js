// public/config.js
(function () {
  const isGitpod = window.location.hostname.includes('gitpod.io');

  window.env = {
    BASE_URL: isGitpod
      ? window.location.origin.replace('https://', 'https://7000-') // Ajusta según tu puerto
      : 'http://localhost:7000',

    API_URL: 'https://api.example.com',
    DEBUG: true,
    NODE_ENV: isGitpod ? 'gitpod' : 'development',
    // ...otros valores
    BASE_URL_SOCKET: isGitpod
      ? 'wss://' + window.location.hostname.replace('https://', '')
      : 'ws://localhost:7000',
  };
})();
