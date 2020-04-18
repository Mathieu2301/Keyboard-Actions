const ioHook = require('iohook');
const fs = require('fs');

const modules = [];

fs.readdir('./modules', (err, modules_files) => {
  modules_files.forEach(mod_file => {
    modules.push(require(`./modules/${mod_file}`));
  });
});

ioHook.on('keypress', e => {
  modules.forEach(module => {
    module.shortcuts.forEach(shortcut => {
      let valid = true;
      Object.keys(shortcut).forEach(condition => {
        if (e[condition] !== shortcut[condition]) valid = false;
      });
      if (valid) module.handle(e);
    });
  });
});

ioHook.start();
