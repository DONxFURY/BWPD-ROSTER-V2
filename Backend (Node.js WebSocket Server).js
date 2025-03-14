const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let officers = [
  {badge: 'A101', name: 'John Doe', callsign: 'Unit 1', rank: 'Officer', activeHours: 0, status: 'clocked-out', clockInTime: null, clockOutTime: null, username: 'johndoe', password: 'pass123'},
  {badge: 'A102', name: 'Jane Smith', callsign: 'Unit 2', rank: 'Supervisor', activeHours: 0, status: 'clocked-out', clockInTime: null, clockOutTime: null, username: 'janesmith', password: 'pass456'},
  {badge: 'A103', name: 'James Brown', callsign: 'Unit 3', rank: 'Admin', activeHours: 0, status: 'clocked-out', clockInTime: null, clockOutTime: null, username: 'jamesbrown', password: 'pass789'}
];

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send the officer list to the new client
  ws.send(JSON.stringify({ type: 'officers', data: officers }));
  
  // Handle incoming messages (updates to officers data)
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    
    if (parsedMessage.type === 'update') {
      // Update the officers array based on the message
      officers = parsedMessage.data;
      
      // Broadcast the updated officers list to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'officers', data: officers }));
        }
      });
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
