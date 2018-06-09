/* @flow */

import { StyleSheet } from "react-native";

const isNumber = value => Number.isFinite(value);
const isString = value => Number.isNaN(value);

const validateStyles = {
  // VIEW - styles
  backfaceVisibility: [value => ["visible", "hidden"].includes(value)],
  borderColor: [isString],
  borderTopColor: [isString],
  borderRightColor: [isString],
  borderBottomColor: [isString],
  borderLeftColor: [isString],
  borderWidth: [isNumber],
  borderTopWidth: [isNumber],
  borderRightWidth: [isNumber],
  borderBottomWidth: [isNumber],
  borderLeftWidth: [isNumber],
  borderRadius: [isNumber],
  borderStyle: [value => ["solid", "dotted", "dashed"].includes(value)],
  // TEXT - styles
  // fontFamily - can't prevent crash, since fonts are loaded dynamically
  fontSize: [isNumber],
  fontStyle: [value => ["normal", "italic"].includes(value)],
  fontVariant: [
    value =>
      [
        "small-caps",
        "oldstyle-nums",
        "lining-nums",
        "tabular-nums",
        "proportional-nums"
      ].includes(value)
  ],
  fontWeight: [
    value =>
      [
        "normal",
        "bold",
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900"
      ].includes(value)
  ],
  letterSpacing: [isNumber],
  lineHeight: [isNumber],
  opacity: [isNumber],
  textAlign: [
    value => ["auto", "left", "right", "center", "justify"].includes(value)
  ],
  textDecorationLine: [
    value =>
      ["none", "underline", "line-through", "underline line-through"].includes(
        value
      )
  ],
  textDecorationStyle: [
    value => ["solid", "double", "dotted", "dashed"].includes(value)
  ]
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
