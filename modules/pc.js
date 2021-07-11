const { exec } = require('child_process');

global.tcpListen((packet) => {
  if (packet === 'pcAction:shutdown') exec('rundll32.exe powrprof.dll,SetSuspendState 0,0,0');
  else if (packet === 'pcAction:lock') exec('rundll32.exe user32.dll,LockWorkStation');
  else if (packet === 'pcAction:screenOff') global.tcpSend('screens:off');
  else if (packet === 'pcAction:screenOn') global.tcpSend('screens:on');
});
