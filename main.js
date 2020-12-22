const ioHook = require('iohook');
const fs = require('fs');

const modules = [];

fs.readdir('./modules', (_, modules_files) => {
  modules_files.forEach((mod_file) => {
    if (!fs.lstatSync(`./modules/${mod_file}`).isFile()) return;
    modules.push(require(`./modules/${mod_file}`));
  });
});

let lastPress = null;
ioHook.on('keypress', (e) => {
  const newPress = Object.values(e).toString();
  if (lastPress === newPress) return;
  lastPress = newPress;

  modules.forEach((module) => {
    if (!module.shortcuts) return;
    module.shortcuts.forEach((shortcut) => {
      let valid = true;
      Object.keys(shortcut).forEach((condition) => {
        if (e[condition] !== shortcut[condition]) valid = false;
      });
      if (valid) module.handle(e);
    });
  });
  setTimeout(() => lastPress = null, 200);
});

ioHook.start();
