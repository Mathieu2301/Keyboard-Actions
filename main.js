const NDI = require('node-direct-input');
const fs = require('fs');

const di = new NDI.nodeDirectInput();

let ok = false;
function init() {
  if (ok) return;
  ok = true;

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
}

require('miakapi').Widget(require('./miakapp.json'), (error) => {
  console.log('Widget error :', error.message);
}, (widget) => {
  console.log('Started !');
  global.miakapp = widget;
  init();
});
