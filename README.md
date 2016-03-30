## Warpwallet Dismantled
Everything required for a [warpwallet](https://github.com/keybase/warpwallet) in any development environment.

## Features

* 100% dependence on trusted third party applications managed by Bower
* Core `warpwallet.js` separated from the front end `warpwallet-ui.js`
* Minified (compressed) Javascript versions available
* Use Grunt and Git to ensure that all the code has been compiled from trusted sources (specifically [Keybase](https://keybase.io/) & [Bitcoin.org](https://bitcoin.org/en/))
* Absolutely no front end framework or CSS (no Bootstrap or Foundation)

## Getting Started

- Run `bower install warpwallet-dismantled --save` to add this as a dependency in your app
- Reference the warpwallet Javascript in your app like so:

```
<script src="../bower_components/warpwallet-dismantled/dist/warpwallet.min.js"></script>
<script src="../bower_components/warpwallet-dismantled/dist/warpwallet-ui.min.js"></script>
```

Or simply copy and paste these files to your app.

## Verify The Authenticity of The Code

- Install core dependencies: `npm install --save-dev`
- Install warpwallet dependencies: `bower install`
- Run `grunt` to recompile all Javascript in the _dist_ folder
- Run `git status` to verify that the recompiled code is identical

## Contributors

- David Apple <davidapple@protonmail.com> - Initial implementation
- Donate Bitcoin: 13D3A8PP91MLF5VTBQMH5HG76F42RNRF28

## Special Thanks

Special thanks to [Keybase](https://keybase.io/) for creating warpwallet.
