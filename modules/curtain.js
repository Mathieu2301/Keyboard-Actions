module.exports = {
  events: {
    open: ['LEFTSHIFT', 'LEFTALT', 'EQUALS'],
    close: ['LEFTSHIFT', 'LEFTALT', 'MINUS'],
  },
  handle(event) {
    global.miakapp.broadcast({
      type: 'PC_EVENT',
      name: 'CURTAIN',
      action: event, // 'open' or 'close'
    });
  },
};
