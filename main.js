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

// Connect to a gateway with TCP

const gateway = { host: '192.168.0.33', port: 7777 };

const s = net.connect(gateway, () => console.log('Connected !'));

global.tcpSend = ((data) => {
  s.write(`${data};`);
});

s.on('data', (data) => {
  tcpListeners.forEach((l) => l(data.toString()));
});

s.on('error', (err) => console.log('TCP Error', err));
s.on('close', () => {
  console.log('Closed, reconnecting...');
  setTimeout(() => s.connect(gateway, () => console.log('Reconnected !')), 1000);
});
