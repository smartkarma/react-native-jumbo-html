/* @flow */
import * as React from "react";
import { WebView, StyleSheet } from "react-native";
import ViewStylePropTypes from "react-native/Libraries/Components/View/ViewStylePropTypes";
import filterStyles from "../utils/filter-styles";
import type { RendererProps } from "../utils/render-native";

type Props = RendererProps & {
  attrs: {
    src?: string,
    width?: string,
    height?: string
  }
};

const styles = StyleSheet.create({
  iframe: {
    width: "100%",
    height: 360
  }
});

export default class IframeRenderer extends React.PureComponent<Props> {
  render() {
    const { tagName, attrs, classList, style, ...rest } = this.props;

    let { src } = attrs;

    if (!src) {
      return null;
    }

    if (src.startsWith("//")) {
      src = `https:${src}`;
    }

    const flattened = StyleSheet.flatten(style);

    const width = parseFloat(attrs.width);
    const height = parseFloat(attrs.height);

    const dimensions = {};

    if (Number.isFinite(width)) {
      dimensions.width = width;
    }

    if (Number.isFinite(height)) {
      dimensions.height = height;
    }

    if (
      flattened &&
      Number.isFinite(height) &&
      Number.isFinite(width) &&
      Number.isFinite(flattened.maxWidth) &&
      width > flattened.maxWidth
    ) {
      // If a maxWidth is specified, we scale down the iframe height
      dimensions.height = height * (flattened.maxWidth / width);
      dimensions.width = flattened.maxWidth;
    }

    return (
      <WebView
        source={{ uri: src }}
        style={[
          styles.iframe,
          dimensions,
          filterStyles(style, [ViewStylePropTypes])
        ]}
        {...rest}
      />
    );
  }
}
