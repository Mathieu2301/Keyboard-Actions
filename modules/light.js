module.exports = {
  events: {
    toggle: ['LEFTSHIFT', 'LEFTALT', 'BACK'],
  },
  handle() {
    global.tcpSend('light:toggle');
  },
};
