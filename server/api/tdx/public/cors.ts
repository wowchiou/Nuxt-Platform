export default defineEventHandler((event) => {
  const isDev = process.env.NODE_ENV === 'development';

  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': isDev ? '*' : 'https://wowchiou.github.io',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });

  if (event.node.req.method === 'OPTIONS') {
    event.node.res.statusCode = 204;
    event.node.res.end();
  }
});
