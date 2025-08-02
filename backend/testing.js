// testing.js
// This script tests that all main routes are up and responding.
import request from 'supertest';
import app from './app.js';



// Helper to pause for DB consistency
const sleep = ms => new Promise(res => setTimeout(res, ms));

// Fake user and admin data
const fakeUser = {
  user_name: 'testuser',
  email: 'testuser@example.com',
  password: 'TestPass123!'
};
const fakeAdmin = {
  user_name: 'adminuser',
  email: 'adminuser@example.com',
  password: 'AdminPass123!'
};

let userToken = '';
let adminToken = '';
let userId = '';
let adminId = '';

async function setupUsers() {
  // Register user
  await request(app).post('/user/register').send(fakeUser);
  const loginRes = await request(app).post('/user/login').send({ email: fakeUser.email, password: fakeUser.password });
  userToken = loginRes.body.token;
  userId = loginRes.body.user?.id || 1;

  // Register admin (as user)
  await request(app).post('/user/register').send(fakeAdmin);
  const adminLoginRes = await request(app).post('/user/login').send({ email: fakeAdmin.email, password: fakeAdmin.password });
  adminToken = adminLoginRes.body.token;
  adminId = adminLoginRes.body.user?.id || 2;

  // Optionally, promote admin user to admin in DB if needed
  // This step may require direct DB access or a special endpoint
  // For now, assume admin user is recognized as admin
}

const routes = [
  // user.routes.js
  { method: 'post', path: '/api/users/register', auth: false, data: fakeUser },
  { method: 'post', path: '/api/users/login', auth: false, data: { email: fakeUser.email, password: fakeUser.password } },
  { method: 'get', path: '/api/users/me', auth: 'user' },

  // notification.routes.js
  { method: 'get', path: '/api/notifications/', auth: 'user' },
  { method: 'patch', path: '/api/notifications/1/read', auth: 'user' },

  // location.routes.js
  { method: 'get', path: `/api/locations/${userId || 1}/locations`, auth: 'user' },
  { method: 'post', path: `/api/locations/${userId || 1}/locations`, auth: 'user', data: { latitude: 1, longitude: 1, address: 'Test', is_primary: true } },

  // issue.routes.js
  { method: 'get', path: '/api/issue/' },
  { method: 'post', path: '/api/issue/', auth: 'user', data: { title: 'Test Issue', description: 'desc', category_id: 1, latitude: 0, longitude: 0, address: 'Test', is_anonymous: false } },
  { method: 'get', path: '/api/issue/1' },
  { method: 'get', path: '/api/issue/1/photos' },
  { method: 'post', path: '/api/issue/1/photos', auth: 'user' },
  { method: 'get', path: '/api/issue/1/comments' },
  { method: 'post', path: '/api/issue/1/comment', auth: 'user', data: { comment_text: 'Nice!' } },
  { method: 'get', path: '/api/issue/1/status-log' },
  { method: 'patch', path: '/api/issue/1/status', auth: 'admin', data: { status: 'closed' } },
  { method: 'post', path: '/api/issue/1/flag', auth: 'user', data: { flag_reason: 'spam', flag_description: 'Looks like spam' } },
  { method: 'post', path: '/api/issue/1/upvote', auth: 'user' },
  { method: 'post', path: '/api/issue/1/downvote', auth: 'user' },
  { method: 'get', path: '/api/issue/map/pins' },
  { method: 'get', path: '/api/issue/nearby' },

  // admin.routes.js
  { method: 'get', path: '/api/admin/users', auth: 'admin' },
  { method: 'patch', path: '/api/admin/users/1/ban', auth: 'admin' },
  { method: 'get', path: '/api/admin/categories', auth: 'admin' },
  { method: 'post', path: '/api/admin/categories', auth: 'admin', data: { name: 'TestCat', color_code: '#fff' } },
  { method: 'patch', path: '/api/admin/categories/1', auth: 'admin', data: { name: 'TestCat2', color_code: '#000' } },
  { method: 'delete', path: '/api/admin/categories/1', auth: 'admin' },
  { method: 'get', path: '/api/admin/issues/flagged', auth: 'admin' },
  { method: 'patch', path: '/api/admin/issues/1/hide', auth: 'admin' },
  { method: 'delete', path: '/api/admin/issues/1/delete', auth: 'admin' },
  { method: 'get', path: '/api/admin/analytics/summary', auth: 'admin' },

  // admin.analytics.routes.js
  { method: 'get', path: '/api/admin/analytics/daily', auth: 'admin' },
  { method: 'get', path: '/api/admin/actions', auth: 'admin' },
  { method: 'get', path: '/api/admin/flags', auth: 'admin' },
];


(async () => {
  await setupUsers();
  await sleep(500); // Wait for DB consistency

  for (const route of routes) {
    try {
      let req = request(app)[route.method](route.path);
      if (route.auth === 'user') req = req.set('Authorization', `Bearer ${userToken}`);
      if (route.auth === 'admin') req = req.set('Authorization', `Bearer ${adminToken}`);
      if (route.data) req = req.send(route.data);
      const res = await req;
      console.log(`${route.method.toUpperCase()} ${route.path}: Status ${res.statusCode}`);
    } catch (err) {
      console.error(`${route.method.toUpperCase()} ${route.path}: ERROR`, err.message);
    }
  }
  process.exit();
})();
