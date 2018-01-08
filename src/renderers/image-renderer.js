/* @flow */
/* eslint-disable react-native/no-unused-styles, react-native/no-color-literals */

import * as React from "react";
import { View, Image, StyleSheet } from "react-native";
import ImageStylePropTypes from "react-native/Libraries/Image/ImageStylePropTypes";
import ViewStylePropTypes from "react-native/Libraries/Components/View/ViewStylePropTypes";
import filterStyles from "../utils/filter-styles";
import type { RendererProps } from "../utils/render-native";

type Props = RendererProps & {
  attrs: {
    src: string
  },
  navigation: {
    navigate: Function
  }
};

type State = {
  height: number,
  width: number,
  error: ?Error
};

export default class ImageRenderer extends React.PureComponent<Props, State> {
  state: State = {
    height: 0,
    width: 0,
    error: null
  };

  componentDidMount() {
    this.updateImageSize(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.attrs.src !== nextProps.attrs.src) {
      this.updateImageSize(nextProps);
    }
  }

  updateImageSize = (props: Props) => {
    const flattened = StyleSheet.flatten(props.style);

    if (flattened && flattened.height && flattened.width) {
      // Only try to fetch the image dimensions if not specified
      return;
    }

    Image.getSize(
      props.attrs.src,
      (width, height) => {
        let ratio = 1;

        if (
          flattened &&
          Number.isFinite(flattened.maxWidth) &&
          width > flattened.maxWidth
        ) {
          // If a maxWidth is specified, we scale down the image height too
          ratio = flattened.maxWidth / width;
        }

        this.setState({
          width: width * ratio,
          height: height * ratio,
          error: null
        });
      },
      error => this.setState({ error })
    );
  };

  render() {
    const { tagName, attrs, classList, style, children, ...rest } = this.props;

    if (this.state.error) {
      return (
        <View
          style={[
            filterStyles(style, [ViewStylePropTypes]),
            // eslint-disable-next-line no-use-before-define
            styles.broken
          ]}
        />
      );
    }

    return (
      <Image
        source={{ uri: attrs.src }}
        style={[
          { height: this.state.height, width: this.state.width },
          filterStyles(style, [ImageStylePropTypes])
        ]}
        {...rest}
      />
    );
  }
}

const styles = StyleSheet.create({
  broken: {
    backgroundColor: "lightgrey",
    borderColor: "red",
    borderWidth: StyleSheet.hairlineWidth,
    height: 50,
    width: 50
  }
});
