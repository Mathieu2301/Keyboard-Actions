const os = require('os');

function getCPUInfo() {
  let total = 0;
  let idle = 0;

  os.cpus().forEach((cpu) => {
    Object.values(cpu.times).forEach((v) => { total += v; });
    idle += cpu.times.idle;
  });

  return { idle, total };
}

exports.cpuUsage = (callback) => {
  const stats1 = getCPUInfo();

  setTimeout(() => {
    const stats2 = getCPUInfo();
    callback(1 - ((stats2.idle - stats1.idle) / (stats2.total - stats1.total)));
  }, 1000);
};
