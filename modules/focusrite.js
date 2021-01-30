const focusrite = require('focusrite');
const clientKey = '6e9e8b6d-dbca-4936-a136-dfddfe030feb';

focusrite.findServerPort((port) => {
  const config = {
    airmode: null,
    instmode: null,
    last_instpush: 0,
  };

  focusrite.createFakeClient(port, clientKey, (onData, clientWrite) => {
    onData((data) => {
      let airmode = data.toString().match(/id="23" value\=\"([truefals]*)\"/);
      let instmode = data.toString().match(/id="28" value\=\"([LineInst]*)\"/);

      if (airmode && config.airmode !== airmode[1]) {
        if (config.airmode) global.miakapp.broadcast({
          type: 'PC_EVENT',
          name: 'CURTAIN',
          action: (airmode[1] == 'true' ? 'open' : 'close'),
        });

        config.airmode = airmode[1];
      }

      if (instmode && config.instmode !== instmode[1]) {
        config.instmode = instmode[1];

        if (Date.now() - config.last_instpush < 200) {
          if (!config.rainbow) {
            clientWrite(focusrite.requests.MODE_NORMAL);
            clientWrite(focusrite.requests.MODE_COLOR);
            config.rainbow = true;
            changeColor();
          } else {
            clientWrite(focusrite.requests.MODE_NORMAL);
            config.rainbow = false;
          }
        } else config.last_instpush = Date.now();
      }
    });

    let i = 0;
    function changeColor() {
      if (!config.rainbow) return;
      let rq = focusrite.colors.fromIndex(i++);
      if (!rq) {
        i = 0;
        rq = focusrite.colors.fromIndex(i);
      }
      clientWrite(rq);
      if (config.rainbow) setTimeout(changeColor, 40);
    }

    global.miakapp.onEvent((data) => {
      if (data.type === 'DOOR' && data.door === 'DOOR_3') {
        if (data.value) {
          clientWrite(focusrite.requests.MODE_NORMAL);
          clientWrite(focusrite.requests.MODE_COLOR);
          clientWrite(focusrite.colors.RED);

          clientWrite(focusrite.requests.A1_PREAMP_FALSE); // Disable
          config.airmode = 'false';
        } else {
          clientWrite(focusrite.requests.MODE_NORMAL);

          clientWrite(focusrite.requests.A1_PREAMP_TRUE); // Enable
          config.airmode = 'true';
        }
      }
    });
  });
});

Object.prototype.fromIndex = function(i) {
  const keys = Object.keys(this);
  return this[keys[i]];
}
