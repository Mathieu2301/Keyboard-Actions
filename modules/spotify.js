const { spawn } = require('child_process');

let spotify = null;
function Spotify() {
  if (spotify) spotify.kill();
  spotify = spawn(`${process.env.APPDATA}\\Spotify\\Spotify.exe`);
}

global.tcpListen((packet) => {
  if (packet === 'spotify:restart') Spotify();
});

module.exports = {
  events: {
    restart: ['LEFTSHIFT', 'LEFTALT', 'RETURN'],
  },
  handle: Spotify,
};
