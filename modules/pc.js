const os = require('os');
const cpu = require('./libs/cpuUsage');
const exec = require('child_process').exec;

setInterval(() => {
  cpu.cpuUsage((val) => {
    const cpu = Math.round(val * 100);
    if (global.miakapp.data.cpu !== cpu) broadCastInfos({ cpu });
  });

  const total = os.totalmem();
  const mem = Math.round((total - os.freemem()) / total * 100);
  if (global.miakapp.data.mem !== mem) broadCastInfos({ mem });
}, 1000);

function broadCastInfos(data) {
  global.miakapp.commit(data);
  global.miakapp.broadcast({
    type: 'PC_EVENT',
    name: 'PC_INFOS',
    values: global.miakapp.data,
  });
}

const actions = {
  PC_SHUTDOWN: () => exec('rundll32.exe powrprof.dll,SetSuspendState 0,0,0'),
  PC_LOCK: () => exec('rundll32.exe user32.dll,LockWorkStation'),
}

global.miakapp.onCallback('pc_action', (name) => {
  if (actions[name]) actions[name]();
  else if (name === 'APP_SPOTIFY') global.miakapp.broadcast({ type: 'PC_ACTION', name });
})

global.miakapp.onEvent((e) => {
  if (e.type === 'PC_ACTION' && actions[e.name]) actions[e.name]();
});
