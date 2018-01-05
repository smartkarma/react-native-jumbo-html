/* @flow */
/* eslint-disable react-native/no-unused-styles, react-native/no-color-literals */

import { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import TextStylePropTypes from "react-native/Libraries/Text/TextStylePropTypes";
import parseHTML from "../utils/parse-html";
import renderNative from "../utils/render-native";
import filterStyles from "../utils/filter-styles";

type Props = {
  html: string,
  mappings: { [tag: string]: Function },
  sheet: { [tag: string]: any }
};

const channel = ":root-text-styles";

export default class HTMLRenderer extends PureComponent<Props, void> {
  static childContextTypes = {
    [channel]: PropTypes.object
  };

  getChildContext() {
    return {
      [channel]: this.getTextStyle()
    };
  }

  getTextStyle = () => {
    if (this.textStyleCache) {
      return this.textStyleCache;
    }

    const style =
      // eslint-disable-next-line react/prop-types
      this.props.sheet && this.props.sheet[":root"]
        ? this.props.sheet[":root"]
        : null;

    if (style) {
      // eslint-disable-next-line prefer-destructuring
      this.textStyleCache = filterStyles(style, [TextStylePropTypes])[0];
      return this.textStyleCache;
    }

    return null;
  };

  textStyleCache = null;

  render() {
    return renderNative(parseHTML(this.props.html), this.props.mappings, [
      styles, // eslint-disable-line no-use-before-define
      this.props.sheet
    ]);
  }
}

const styles = StyleSheet.create({
  h1: {
    fontWeight: "bold",
    fontSize: 28,
    lineHeight: 30,
    marginVertical: 12
  },
  h2: {
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 26,
    marginVertical: 10
  },
  h3: {
    fontWeight: "bold",
    fontSize: 22,
    lineHeight: 24,
    marginVertical: 8
  },
  h4: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 22,
    marginVertical: 6
  },
  h5: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 20,
    marginVertical: 4
  },
  h6: {
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 18,
    marginVertical: 4
  },
  p: {
    marginVertical: 8
  },
  blockquote: {
    marginVertical: 8,
    paddingLeft: 8,
    borderLeftColor: "lightgrey",
    borderLeftWidth: 2,
    fontStyle: "italic"
  },
  figure: {
    marginVertical: 14,
    marginHorizontal: 40
  },
  hr: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "lightgrey",
    marginVertical: 7
  },
  pre: {
    fontFamily: "Courier New"
  },
  code: {
    fontFamily: "Courier New"
  },
  kbd: {
    fontFamily: "Courier New"
  },
  samp: {
    fontFamily: "Courier New"
  },
  a: {
    color: "blue",
    textDecorationLine: "underline"
  },
  b: {
    fontWeight: "bold"
  },
  u: {
    textDecorationLine: "underline"
  },
  s: {
    textDecorationLine: "line-through"
  },
  strike: {
    textDecorationLine: "line-through"
  },
  del: {
    textDecorationLine: "line-through"
  },
  i: {
    fontStyle: "italic"
  },
  em: {
    fontStyle: "italic"
  },
  strong: {
    fontWeight: "bold"
  },
  small: {
    fontSize: 12
  },
  dfn: {
    fontStyle: "italic"
  },
  mark: {
    backgroundColor: "#ff0",
    color: "#000"
  },
  ul: {
    marginLeft: 28
  },
  ol: {
    marginLeft: 28
  }
});
