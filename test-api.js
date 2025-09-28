const fetch = require('node-fetch');

async function testAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: '안녕하세요'
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAPI();
