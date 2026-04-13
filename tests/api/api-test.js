// API tests against JSONPlaceholder (free public REST API)

const http = require('./helpers/http-client');
const { assert, summary } = require('./helpers/assertions');

async function runTests() {
  console.log('\n🔌 API Test Suite\n');

  // GET — list all users
  console.log('GET /users');
  const usersRes = await http.get('/users');
  assert(usersRes.status === 200, 'Status 200');
  assert(Array.isArray(usersRes.body), 'Response is array');
  assert(usersRes.body.length === 10, 'Returns 10 users');
  assert(usersRes.body[0].hasOwnProperty('name'), 'Has name');
  assert(usersRes.body[0].hasOwnProperty('email'), 'Has email');

  // GET — single user by ID
  console.log('\nGET /users/1');
  const userRes = await http.get('/users/1');
  assert(userRes.status === 200, 'Status 200');
  assert(userRes.body.id === 1, 'ID is 1');
  assert(typeof userRes.body.name === 'string', 'Name is string');

  // GET — list all posts
  console.log('\nGET /posts');
  const postsRes = await http.get('/posts');
  assert(postsRes.status === 200, 'Status 200');
  assert(postsRes.body.length === 100, 'Returns 100 posts');

  // GET — filter posts by userId query param
  console.log('\nGET /posts?userId=1');
  const filteredRes = await http.get('/posts?userId=1');
  assert(filteredRes.status === 200, 'Status 200');
  assert(filteredRes.body.length === 10, 'Returns 10 posts');
  assert(filteredRes.body.every((p) => p.userId === 1), 'All belong to user 1');

  // POST — create new resource
  console.log('\nPOST /posts');
  const createRes = await http.post('/posts', {
    body: { title: 'QA Test Post', body: 'Automation testing', userId: 1 },
  });
  assert(createRes.status === 201, 'Status 201');
  assert(createRes.body.title === 'QA Test Post', 'Title matches');

  // PUT — update existing resource
  console.log('\nPUT /posts/1');
  const updateRes = await http.put('/posts/1', {
    body: { id: 1, title: 'Updated Title', body: 'Updated body', userId: 1 },
  });
  assert(updateRes.status === 200, 'Status 200');
  assert(updateRes.body.title === 'Updated Title', 'Title updated');

  // DELETE — remove resource
  console.log('\nDELETE /posts/1');
  const deleteRes = await http.delete('/posts/1');
  assert(deleteRes.status === 200, 'Status 200');

  // GET — verify 404 for non-existent resource
  console.log('\nGET /posts/9999');
  const notFoundRes = await http.get('/posts/9999');
  assert(notFoundRes.status === 404, 'Status 404');

  summary();
}

runTests().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
