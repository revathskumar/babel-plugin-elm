# babel-plugin-elm

Babel plugin that compile elm code embedded in your app

This is a first draft.

## How to use ?

Probably better just to use it in dev and use [`elm-webpack-loader`](https://github.com/elm-community/elm-webpack-loader) for bundling.

```
// .babelrc
{
  // ...
  "env": {
    "test": {
      "plugins": [ "babel-plugin-elm" ]
    }
  }
}
```

## Future features !?

* No watch capability (can be workarounded with `babel-watch`, `mocha --watch`, etc)
* No cache

## Under the hood

The plugin compile the elm code with [`node-elm-compiler`](https://github.com/rtfeldman/node-elm-compiler) in a temporary file and change the path to import for the temporary file.

## Contributions

Nothing less than very welcome :)