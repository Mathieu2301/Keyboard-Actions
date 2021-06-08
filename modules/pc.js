const os = require('os');
const { exec } = require('child_process');
const cpu = require('./libs/cpuUsage');

function broadCastInfos(data) {
  global.miakapp.commit(data);
  global.miakapp.broadcast({
    type: 'PC_EVENT',
    name: 'PC_INFOS',
    values: global.miakapp.data,
  });
}

setInterval(() => {
  cpu.cpuUsage((val) => {
    const cpuLoad = Math.round(val * 100);
    if (global.miakapp.data.cpu !== cpuLoad) broadCastInfos({ cpu: cpuLoad });
  });

  const total = os.totalmem();
  const mem = Math.round(((total - os.freemem()) / total) * 100);
  if (global.miakapp.data.mem !== mem) broadCastInfos({ mem });
}, 1000);

const actions = {
  PC_SHUTDOWN: () => exec('rundll32.exe powrprof.dll,SetSuspendState 0,0,0'),
  PC_LOCK: () => exec('rundll32.exe user32.dll,LockWorkStation'),
};

global.miakapp.onCallback('pc_action', (name) => {
  if (actions[name]) actions[name]();
  else if (name === 'APP_SPOTIFY') global.miakapp.broadcast({ type: 'PC_ACTION', name });
});

global.miakapp.onEvent((e) => {
  if (e.type !== 'PC_ACTION') return;

  if (actions[e.name]) actions[e.name]();

  if (e.name === 'PC_SCREEN_OFF') {
    global.miakapp.broadcast({
      type: 'tuya_setMode',
      device: global.miakapp.config.desk_id,
      value: 0,
    });
  }

  if (e.name === 'PC_SCREEN_ON') {
    global.miakapp.broadcast({
      type: 'tuya_setMode',
      device: global.miakapp.config.desk_id,
      value: 1,
    });
  }
});
