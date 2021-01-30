module.exports = {
  shortcuts: [
    {
      keychar: 176,
      altKey: true,
      shiftKey: true,
      ctrlKey: false,
      metaKey: false,
    },
    {
      keychar: 43,
      altKey: true,
      shiftKey: true,
      ctrlKey: false,
      metaKey: false,
    },
  ],
  handle(e) {
    global.miakapp.broadcast({
      type: 'PC_EVENT',
      name: 'CURTAIN',
      action: (e.keychar === 43 ? 'open' : 'close'),
    });
  },
};
