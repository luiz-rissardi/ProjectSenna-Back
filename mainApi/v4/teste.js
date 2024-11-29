// Teste rápido no Angular
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to the server');
});

socket.on('message', (data) => {
  console.log('Received message:', data);
});
