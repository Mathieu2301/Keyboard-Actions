const NDI = require('node-direct-input');
const fs = require('fs');
const net = require('net');

const di = new NDI.nodeDirectInput();

const tcpListeners = [];

global.tcpListen = (cb) => {
  tcpListeners.push(cb);
};

global.tcpSend = () => false;

const handlers = {};

fs.readdir('./modules', (_, modulesFiles) => {
  modulesFiles.forEach((modFile) => {
    if (!modFile.endsWith('.js') || !fs.lstatSync(`./modules/${modFile}`).isFile()) return;
    const module = require(`./modules/${modFile}`);
    if (!module.events) return;
    Object.keys(module.events).forEach((evName) => {
      const e = module.events[evName].map((k) => k.toUpperCase()).sort().toString();
      if (!handlers[e]) handlers[e] = [];
      handlers[e].push([module.handle, evName]);
    });
  });
});

di.listen();

let lastPress = null; // Anti key spam (not very usefull since we switched to node-direct-input)
di.on('ndi:keysPressed', (keys) => {
  const e = keys.map((k) => k.key.toUpperCase()).sort().toString();
  if (lastPress === e) return;
  lastPress = e;
  if (handlers[e]) handlers[e].forEach((h) => h[0](h[1]));
  setTimeout(() => { lastPress = null; }, 200);
});

net.createServer((socket) => {
  if (socket.remoteAddress !== '::ffff:192.168.0.33') return;
  socket.on('data', (data) => {
    tcpListeners.forEach((l) => l(data.toString()));
  });

  global.tcpSend = ((data) => {
    socket.write(`${data};`);
  });
}).listen(7777);
