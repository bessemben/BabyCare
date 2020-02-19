const http = require('http');
const app = require('./app');
const port = process.env.port || 3000;
app.get('/', (req, res) => res.send('start your app'));

const server = http.createServer(app);
server.listen(port);
console.log(port)

