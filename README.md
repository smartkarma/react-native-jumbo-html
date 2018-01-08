# React Native Jumbo HTML

[![Build Status][build-badge]][build]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]

Render HTML tags as React Native components.

## Features

- Supports custom renderers for tags
- Supports inline styles in HTML
- Supports StyleSheet object with tag and class name based styles
- Inbuilt renderers for various tags including images, iframes, list items etc.

## Installation

```sh
yarn add react-native-jumbo-html
```

## API

### `HTMLRenderer`

React component which takes an HTML string and renders it as React Native components.

#### Props

- `html` - string containing the HTML to render
- `mappings` - an object with mappings for tags to React components
- `sheet` - an object with a style sheet, they keys can be tag name or class name selectors

Each component in the `mappings` object will receive the following props:

- `tagName` - name of the tag that's being rendered
- `classList` - an array with the list of class names on the tag
- `attrs` - an object with all the attributes of the tag
- `style` - styles for the component
- `children` - children elements for the component

#### Example

```js
import { StyleSheet, TouchableWithoutFeedback } from 'react-native`;
import { HTMLRenderer } from 'react-native-jumbo-html';
import CustomImage from './CustomImage';

const html = `
  <p>Hello world</p>
`;

const mappings = {
  img: CustomImage
};

export default function App() {
  return (
    <HTMLRenderer
      html={html}
      sheet={styles}
      mappings={mappings}
    />
  );
}

const styles = StyleSheet.create({
  a: {
    color: 'blue'
  },
  '.red': {
    color: 'red'
  }
});
```

### `RendererMappings`

The default list of mappings. You can reuse the mappings when adding additional functionality and don't have to re-implement the components.

## Contributing

While developing, you can run the [example app](/example/README.md) to test your changes.

Make sure your code passes Flow and ESLint. Run the following to verify:

```sh
yarn run flow
yarn run lint
```

To fix formatting errors, run the following:

```sh
yarn run lint -- --fix
```

Remember to add tests for your change if possible.

<!-- badges -->
[build-badge]: https://img.shields.io/circleci/project/github/smartkarma/react-native-jumbo-html/master.svg?style=flat-square
[build]: https://circleci.com/gh/smartkarma/react-native-jumbo-html
[version-badge]: https://img.shields.io/npm/v/react-native-jumbo-html.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-native-jumbo-html
[license-badge]: https://img.shields.io/npm/l/react-native-jumbo-html.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
