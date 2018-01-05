/* @flow */
import * as React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import ViewStylePropTypes from "react-native/Libraries/Components/View/ViewStylePropTypes";
import TextStylePropTypes from "react-native/Libraries/Text/TextStylePropTypes";
import TextRenderer from "./text-renderer";
import filterStyles from "../utils/filter-styles";
import { INLINE_TAGS } from "../utils/render-native";
import type { RendererProps } from "../utils/render-native";

const channel = ":root-text-styles";

export default class BlockRenderer extends React.PureComponent<RendererProps> {
  static contextTypes = {
    [channel]: PropTypes.object
  };

  render() {
    const { tagName, attrs, classList, style, children, ...rest } = this.props;

    // Split the styles to valid view and text styles
    // Pass down any text styles so that they are respected in nested elements
    const [viewStyles, textStyles] = filterStyles(style, [
      ViewStylePropTypes,
      { ...TextStylePropTypes, textTransform: true }
    ]);

    // Get text styles from the context
    // This is useful to set global styles such as fonts
    const rootStyles = this.context[channel];

    const isChildrenInline = React.Children.toArray(children).every(
      child =>
        child
          ? typeof child === "string" ||
            INLINE_TAGS.includes(child.props.tagName)
          : true
    );

    return (
      <View {...rest} style={viewStyles}>
        {isChildrenInline ? (
          <TextRenderer style={textStyles}>{children}</TextRenderer>
        ) : (
          React.Children.map(children, child => {
            if (typeof child === "string") {
              // Since View cannot contain string, nest it in text renderer
              return <TextRenderer style={textStyles}>{child}</TextRenderer>;
            }

            if (child) {
              return React.cloneElement(child, {
                style: [rootStyles, textStyles, child.props.style]
              });
            }

            return child;
          })
        )}
      </View>
    );
  }
}
