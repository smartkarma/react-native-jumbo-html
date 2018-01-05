/* @flow */

import { StyleSheet } from "react-native";

const validateStyles = {
  fontSize: [value => Number.isFinite(value)]
};

const isValidStyle = (style, value) => {
  const rules = validateStyles[style] || [];
  if (rules.length > 0) {
    return !rules.some(rule => rule(value) === false);
  }
  return true;
};

export default function filterStyles(styles: *, types: Object[]) {
  const flattened = StyleSheet.flatten(styles);

  // Loop over the array of propTypes to validate styles
  return types.map(
    propTypes =>
      flattened
        ? Object.keys(flattened).reduce((acc, prop) => {
            if (flattened[prop] !== undefined && propTypes[prop]) {
              // If the style property exists in the valid types, consume it
              // Set the property to undefined so it's not consumed multiple times
              if (isValidStyle(prop, flattened[prop])) {
                acc[prop] = flattened[prop];
                flattened[prop] = undefined;
              }
            }
            return acc;
          }, {})
        : {}
  );
}
