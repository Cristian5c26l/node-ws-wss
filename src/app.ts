import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {

  // console.log(ws);// websocket que contiene informacion del cliente que se está conectando (cliente que puede ser la misma persona que abre diferentes pestañas del navegador web visitando http://127.0.0.1:8080)

  console.log('Client connected');

  ws.on('error', console.error);

  // Ejecutar esta funcion message cuando se reciba informacion del cliente (a aplicacion web index.html) conectado (socket.send del lado del cliente, socket del cliente literalmente es ws)
  ws.on('message', function message(data) {
    //console.log('received: %s', data);
    //console.log('Desde el cliente', data);
    // Ocupar su mismo socket (ws) del cliente para que cuando nos envie un mensaje, se lo regresemos en mayuscula
    //ws.send(data.toString().toUpperCase());
    // Ocupar su mismo socket (ws) del cliente para que cuando nos envie un mensaje, le enviemos el objeto payload:
    const payload = JSON.stringify({
      type: 'custom-message',
      payload: data.toString(),
    });
    
    //ws.send( JSON.stringify(payload) );

    // Broadcast (todos, incluyendo al cliente (ws) que envia el mensaje). Recorrer cada cliente (client) conectado al WebSocketServer (wss) y en caso de que esté conectado, enviarle el payload, que contiene la data que es enviada por el cliente o aplicacion web 
    // wss.clients.forEach(function each(client) {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(payload, { binary: false });
    //
    //   }
    // });

    // Broadcast (todos, excluyendo al cliente (ws) que envia el mensaje)
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(payload, { binary: false });

      }
    });


  });




  // Una vez se conecte un websocket de una aplicacion web index.html, enviarle a dicha aplicación web "Hola desde el servidor!"
  //ws.send('Hola desde el servidor!');
  
  ws.on('close', () => {// Funcion que se ejecuta cuando un cliente se desconecta
    console.log('Client disconnected');
  });
  
});


console.log('Server running on http://localhost:3000');

