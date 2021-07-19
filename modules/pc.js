const { exec } = require('child_process');
const os = require('os');
const cpu = require('./libs/cpuUsage');

const usage = { cpu: 0, mem: 0 };
const totalMem = os.totalmem();

setInterval(() => {
  cpu.cpuUsage((val) => {
    usage.cpu = Math.round(val * 100);
  });

  usage.mem = Math.round(((totalMem - os.freemem()) / totalMem) * 100);

  global.tcpSend(`pc:usage,${usage.cpu},${usage.mem}`);
}, 1000);

global.tcpListen((packet) => {
  if (packet === 'pcAction:shutdown') exec('rundll32.exe powrprof.dll,SetSuspendState 0,0,0');
  else if (packet === 'pcAction:lock') exec('rundll32.exe user32.dll,LockWorkStation');
  else if (packet === 'pcAction:screenOff') global.tcpSend('screens:off');
  else if (packet === 'pcAction:screenOn') global.tcpSend('screens:on');
});
