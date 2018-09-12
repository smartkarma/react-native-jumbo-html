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

    const childrenGroups = [];

    React.Children.toArray(children).forEach(child => {
      const isInline =
        child &&
        (typeof child === "string" ||
          INLINE_TAGS.includes(child.props.tagName));
      const lastGroup =
        childrenGroups.length > 0
          ? childrenGroups[childrenGroups.length - 1]
          : null;
      if (lastGroup && lastGroup.isInline === isInline) {
        lastGroup.children.push(child);
      } else {
        childrenGroups.push({
          key: childrenGroups.length,
          isInline,
          children: [child]
        });
      }
    });

    return (
      <View {...rest} style={viewStyles}>
        {childrenGroups.map(
          group =>
            group.isInline ? (
              <TextRenderer key={group.key} style={textStyles}>
                {group.children}
              </TextRenderer>
            ) : (
              React.Children.map(group.children, child => {
                if (child) {
                  return React.cloneElement(child, {
                    key: group.key,
                    style: [rootStyles, textStyles, child.props.style]
                  });
                }
                return child;
              })
            )
        )}
      </View>
    );
  }
}
