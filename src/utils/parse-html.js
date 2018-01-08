/* @flow */

import HTMLParser from "htmlparser2-without-node-native";
import clean from "htmlclean";

export class HTMLNode {
  constructor(type: string, attrs: {}) {
    this.type = type.toLowerCase();
    this.attrs = attrs;
  }

  type: string;
  attrs: { [key: string]: string };
  children: Array<HTMLNode | string> = [];
  parentNode: HTMLNode;

  append(child: HTMLNode | string) {
    if (child instanceof HTMLNode) {
      // eslint-disable-next-line no-param-reassign
      child.parentNode = this;
    }

    this.children.push(child);
  }
}

export default function parseHTML(content: string): HTMLNode {
  const root: HTMLNode = new HTMLNode("div", {});

  let last = root;

  const html = new HTMLParser.Parser(
    {
      onopentag(name, attrs) {
        const node = new HTMLNode(name, attrs);
        last.append(node);
        last = node;
      },

      ontext(text) {
        if (!/^\s*$/.test(text)) {
          last.append(text);
        }
      },

      onclosetag() {
        last = last.parentNode;
      }
    },
    { decodeEntities: true }
  );

  html.write(clean(content));
  html.end();

  return root;
}
