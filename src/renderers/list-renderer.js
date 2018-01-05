/* @flow */
import * as React from "react";
import { StyleSheet } from "react-native";
import BlockRenderer from "./block-renderer";
import TextRenderer from "./text-renderer";
import type { RendererProps } from "../utils/render-native";

export default class ListRenderer extends React.PureComponent<RendererProps> {
  render() {
    const { children, ...rest } = this.props;

    return (
      <BlockRenderer {...rest}>
        {React.Children.map(children, (child, i) => {
          if (
            typeof child === "object" &&
            child &&
            child.props.tagName === "li"
          ) {
            return (
              /* eslint-disable no-use-before-define */
              <BlockRenderer style={styles.item}>
                <TextRenderer style={styles.bullet}>
                  {rest.tagName === "ul" ? "•" : `${i + 1}.`}
                </TextRenderer>
                {child}
              </BlockRenderer>
            );
          }

          return child;
        })}
      </BlockRenderer>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row"
  },
  bullet: {
    position: "absolute",
    left: -20
  }
});
