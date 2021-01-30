const os = require('os');

exports.cpuUsage = (callback) => { 
  const stats1 = getCPUInfo();

  setTimeout(() => {
    const stats2 = getCPUInfo();
    callback(1 - ((stats2.idle - stats1.idle) / (stats2.total - stats1.total)));
  }, 1000);
}

function getCPUInfo() { 
  const cpus = os.cpus();

  let user = 0;
  let nice = 0;
  let sys = 0;
  let irq = 0;
  let idle = 0;

  for (let cpu in cpus) {
    if (!cpus.hasOwnProperty(cpu)) continue;	
    user += cpus[cpu].times.user;
    nice += cpus[cpu].times.nice;
    sys += cpus[cpu].times.sys;
    irq += cpus[cpu].times.irq;
    idle += cpus[cpu].times.idle;
  }

  return {
    idle, 
    total: user + nice + sys + idle + irq
  };
}
