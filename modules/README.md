# "./modules" directory :
  Put all your modules is this directory.
  You can find examples of modules in the files.
  Each module is independant from others.

## Module sample :
  ```javascript
  module.exports = {
    shortcuts: [
      {
        keychar: 176, // => ')'
        altKey: true,
        shiftKey: true,
        ctrlKey: false,
        metaKey: false,
      },
      {
        keychar: 43, // => '='
        altKey: true,
        shiftKey: true,
        ctrlKey: false,
        metaKey: false,
      },
    ],
    handle(e) {
      // Handles when Shift + Alt + ')'
      // OR 
      // when Shift + Alt + '='
    }
  };
```

# Miakapp
  Each ``.js`` files in this directory will be executed in the instance of the Miakapp widget.
  You can access to the widget by ``global.miakapp``.

## Example:
```javascript
  module.exports = {
    shortcuts: [
      {
        keychar: 176, // => ')'
        altKey: true,
        shiftKey: true,
        ctrlKey: false,
        metaKey: false,
      },
      {
        keychar: 43, // => '='
        altKey: true,
        shiftKey: true,
        ctrlKey: false,
        metaKey: false,
      },
    ],
    handle(e) {
      // Handles when Shift + Alt + ')'
      // OR 
      // when Shift + Alt + '='

      global.miakapp.broadcast({ // Broadcasting an "TOGGLE_LIGHT" event
        type: 'PC_EVENT',
        name: 'TOGGLE_LIGHT',
      });
    }
  };
```
