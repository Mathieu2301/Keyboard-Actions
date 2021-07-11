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
