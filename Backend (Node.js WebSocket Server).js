const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const officers = [
  { badge: 'A101', name: 'John Doe', callsign: 'Unit 1', rank: 'Officer', activeHours: 0, status: 'clocked-out' },
  { badge: 'A102', name: 'Jane Smith', callsign: 'Unit 2', rank: 'Supervisor', activeHours: 0, status: 'clocked-out' },
  { badge: 'A103', name: 'James Brown', callsign: 'Unit 3', rank: 'Admin', activeHours: 0, status: 'clocked-out' }
];

wss.on('connection', ws => {
  console.log('New connection established');
  
  // Send initial roster data to the new client
  ws.send(JSON.stringify({ type: 'initialRoster', data: officers }));
  
  // Broadcast updated officer data to all connected clients
  ws.on('message', message => {
    const data = JSON.parse(message);
    if (data.type === 'updateRoster') {
      officers[data.index] = data.officer; // Update officer data
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'updateRoster', data: officers }));
        }
      });
    }
  });
});
