module.exports = {
  events: {
    toggle: ['LEFTSHIFT', 'LEFTALT', 'BACK'],
  },
  handle() {
    global.miakapp.broadcast({
      type: 'PC_EVENT',
      name: 'TOGGLE_LIGHT',
    });
  },
};
