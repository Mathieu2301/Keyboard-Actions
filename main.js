const ioHook = require('iohook');
const fs = require('fs');

require('miakapi').Widget(
  require('./miakapp.json'),
(error) => {
  console.log('Widget error :', error.message);
}, (widget) => {
  console.log('Started !');
  global.miakapp = widget;
  init();
});

function init() {
  const modules = [];

  fs.readdir('./modules', (_, modules_files) => {
    modules_files.forEach((mod_file) => {
      if (!mod_file.endsWith('.js') || !fs.lstatSync(`./modules/${mod_file}`).isFile()) return;
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
}
