module.exports = {
  shortcuts: [
    {
      keychar: 8,
      altKey: true,
      shiftKey: true,
      ctrlKey: false,
      metaKey: false,
    },
  ],
  handle() {
    global.miakapp.broadcast({
      type: 'PC_EVENT',
      name: 'TOGGLE_LIGHT',
    });
  },
};
