module.exports = {
  events: {
    open: ['LEFTSHIFT', 'LEFTALT', 'EQUALS'],
    close: ['LEFTSHIFT', 'LEFTALT', 'MINUS'],
  },
  handle(event) {
    global.tcpSend(`curtain:${event}`);
  },
};
