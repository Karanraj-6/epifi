
async function testApi() {
  try {
    console.log('Registering...');
    const regResp = await fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_nodefetch@test.com', password: 'password123' })
    });
    console.log('Register status:', regResp.status);
    console.log('Register body:', await regResp.text());

    console.log('Logging in...');
    const loginResp = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_nodefetch@test.com', password: 'password123' })
    });
    console.log('Login status:', loginResp.status);
    const loginData = await loginResp.json();
    console.log('Token received:', !!loginData.access_token);

    const token = loginData.access_token;
    console.log('Creating note...');
    const noteResp = await fetch('http://localhost:4000/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: 'Test NodeFetch Note', content: 'It works!' })
    });
    console.log('Note creation status:', noteResp.status);
    const noteData = await noteResp.json();
    console.log('Note:', noteData);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

testApi();
