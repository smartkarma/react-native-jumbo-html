/* @flow */
import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import TextStylePropTypes from "react-native/Libraries/Text/TextStylePropTypes";
import filterStyles from "../utils/filter-styles";
import { BLOCK_TAGS } from "../utils/render-native";
import type { RendererProps } from "../utils/render-native";

type Props = RendererProps & {
  onPress?: () => mixed
};

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  text: {
    backgroundColor: "transparent"
  }
});

export default class TextRenderer extends React.PureComponent<Props> {
  isChildrenBlock = (children: any | void) =>
    React.Children.toArray(children).some(
      child =>
        child
          ? typeof child !== "string" &&
            child.props &&
            (BLOCK_TAGS.includes(child.props.tagName) ||
              this.isChildrenBlock(child.props.children))
          : false
    );

  render() {
    const { tagName, attrs, classList, style, children, ...rest } = this.props;

    const [textStyle, additional] = filterStyles(style, [
      TextStylePropTypes,
      { textTransform: true }
    ]);

    const isChildrenBlock = this.isChildrenBlock(children);

    const transformedChildren = React.Children.map(children, child => {
      if (typeof child === "string") {
        /* $FlowFixMe */
        switch (additional.textTransform) { // eslint-disable-line default-case
          case "uppercase":
            return child.toUpperCase();
          case "lowercase":
            return child.toLowerCase();
          case "capitalize":
            return child.charAt(0).toUpperCase() + child.slice(1);
        }
      }

      return child;
    });

    if (isChildrenBlock) {
      return (
        <View style={styles.text}>
          {transformedChildren.map(child => {
            if (typeof child === "string") {
              return <Text style={[styles.text, textStyle]}>{child}</Text>;
            }

            return child;
          })}
        </View>
      );
    }

    return (
      <Text style={[styles.text, textStyle]} {...rest}>
        {transformedChildren}
      </Text>
    );
  }
}
