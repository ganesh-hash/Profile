const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

// Function to handle requests and send responses
function handleRequest(req, res) {
    if (req.method === 'GET') {
        if (req.url === '/') {
            // Serve the HTML form
            fs.readFile('index.html', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.write('Internal Server Error');
                    res.end();
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                }
            });
        } else if (req.url === '/script.js') {
            // Serve the JavaScript file
            fs.readFile('script.js', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.write('Internal Server Error');
                    res.end();
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                }
            });
        }
    } else if (req.method === 'POST' && req.url === '/submit-form') {
        // Handle form submission
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const parsedData = parse(body);
            const contactData = `
                Full Name: ${parsedData.fullName}
                Email: ${parsedData.email}
                Phone Number: ${parsedData.phoneNumber}
                Subject: ${parsedData.subject}
                Message: ${parsedData.message}
            `;

            // Save the contact data to a text file
            const filePath = path.join(__dirname, 'contacts.txt');
            fs.appendFile(filePath, contactData + '\n', (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.write('Internal Server Error');
                    res.end();
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.write('Contact information saved successfully');
                    res.end();
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Not Found');
        res.end();
    }
}

// Create an HTTP server
const server = http.createServer(handleRequest);

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});