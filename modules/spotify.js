const { spawn } = require('child_process');
let spotify = null;

function Spotify() {
  if (spotify) spotify.kill();
  spotify = spawn(`${process.env.APPDATA}\\Spotify\\Spotify.exe`);
}

global.miakapp.onEvent((e) => {
  if (e.type === 'PC_ACTION' && e.name === 'APP_SPOTIFY') Spotify();
});

module.exports = {
  shortcuts: [
    {
      keychar: 13,
      altKey: true,
      shiftKey: true,
      ctrlKey: false,
      metaKey: false,
    },
  ],
  handle: Spotify,
};
