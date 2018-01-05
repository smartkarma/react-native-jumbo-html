/* @flow */

import * as React from "react";
import css from "css-to-react-native";
import BlockRenderer from "../renderers/block-renderer";
import TextRenderer from "../renderers/text-renderer";
import ImageRenderer from "../renderers/image-renderer";
import IframeRenderer from "../renderers/iframe-renderer";
import ListRenderer from "../renderers/list-renderer";
import { HTMLNode } from "./parse-html";

export type RendererProps = {
  tagName?: string,
  classList?: string[],
  attrs?: { [key: string]: string },
  style: any,
  children?: any
};

export const BLOCK_TAGS = [
  "address",
  "area",
  "article",
  "aside",
  "blockquote",
  "body",
  "center",
  "cite",
  "data",
  "dd",
  "div",
  "dl",
  "dt",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hgroup",
  "hr",
  "html",
  "li",
  "main",
  "map",
  "nav",
  "ol",
  "p",
  "pre",
  "rp",
  "rtc",
  "ruby",
  "section",
  "table",
  "tbody",
  "td",
  "th",
  "tr",
  "ul"
];

export const INLINE_TAGS = [
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "big",
  "blink",
  "bold",
  "br",
  "code",
  "del",
  "dfn",
  "em",
  "figcaption",
  "font",
  "i",
  "ins",
  "kbd",
  "mark",
  "q",
  "rt",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr"
];

export const mappings = {
  // Set renderer for the default block elements
  ...BLOCK_TAGS.reduce((acc, curr) => {
    acc[curr] = BlockRenderer;
    return acc;
  }, {}),
  // Set renderer for default inline elements
  ...INLINE_TAGS.reduce((acc, curr) => {
    acc[curr] = TextRenderer;
    return acc;
  }, {}),
  img: ImageRenderer,
  iframe: IframeRenderer,
  ul: ListRenderer,
  ol: ListRenderer
};

export default function renderNative(
  node: HTMLNode | string,
  customMappings: { [tag: string]: Function },
  sheets: any[]
) {
  if (typeof node === "string") {
    // Don't process node if it's a string
    // Renderers can check and handle strings
    return node;
  }

  const Comp =
    // If a custom mapping is provided for the tag, use it
    // Otherwise use the one from default mapping
    customMappings && node.type in customMappings
      ? customMappings[node.type]
      : mappings[node.type];

  if (typeof Comp !== "function") {
    // Don't render a tag if it doesn't have a mapping
    return null;
  }

  let style;

  try {
    style = node.attrs.style
      ? css(
          // Generate a 2D array from the inline style string
          node.attrs.style
            // Split lines to 'property: value' pair and filter empty values
            .split(";")
            .filter(Boolean)
            // Split 'property: value' pair to an array
            .map(r => r.split(":").map(it => it.trim()))
        )
      : undefined;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }

  // Extract the class names from the class attribute
  const classList = node.attrs.class
    ? node.attrs.class.split(" ").map(c => c.trim())
    : [];

  // Prepend the tag name as a selector as it has a lower specificity
  const selectors = [node.type, ...classList.map(c => `.${c}`)];

  const props = {
    tagName: node.type,
    classList,
    attrs: node.attrs,
    // Replace the style attribute with our style object
    style: [
      // Select styles from provided styles sheet objects based on the selectors
      ...selectors.map(s => sheets.map(sheet => sheet[s])),
      // Inline styles should override styles from stylesheet
      style
    ]
  };

  // Loop over children nodes to render as react elements
  const children = node.children.map((child, i) => {
    const el = renderNative(child, customMappings, sheets);
    return typeof el === "object" && el != null
      ? // Add index as the key for valid elements to suppress warning from React
        React.cloneElement(el, { key: i }) // eslint-disable-line react/no-array-index-key
      : el;
  });

  return <Comp {...props}>{children}</Comp>;
}
