/* @flow */
/* eslint-disable max-len */

import React from "react";
import { StyleSheet, ScrollView, Linking } from "react-native";
import { Constants } from "expo";
import { HTMLRenderer, RendererMappings } from "react-native-jumbo-html";
import type { RendererProps } from "react-native-jumbo-html";

const html = `
<main>
  <section>
    <hgroup>
      <h1>h1 HTML5 Kitchen Sink</h1>
      <h2>h2 Back in my quaint <a href='#'>garden</a></h2>
      <h3>h3 Jaunty <a href='#'>zinnias</a> vie with flaunting phlox</h3>
      <h4>h4 Five or six big jet planes zoomed quickly by the new tower.</h4>
      <h5>h5 Expect skilled signwriters to use many jazzy, quaint old alphabets effectively.</h5>
      <h6>h6 Pack my box with five dozen liquor jugs.</h6>
    </hgroup>
  </section>
  <br/>
  <p>My awesome text <strong>in html</strong><br>hi</p>
  <br/>
  <div>
    br in div
    <br/>
    <br/>
    new line
  </div>
  <hr>
  <section>
    <header>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </header>
    <article>
      <p>This paragraph is nested inside an article. It contains many different, sometimes useful, <a href="http://www.w3schools.com/tags/">HTML5 tags</a>. Of course there are classics like <em>emphasis</em>, <strong>strong</strong>, and <small>small</small>        but there are many others as well. Hover the following text for abbreviation tag: <abbr title="abbreviation">abbr</abbr>. Similarly, you can use acronym tag like this: <acronym title="For The Win">ftw</acronym>. You can define <del>deleted text</del>        which often gets replaced with <ins>inserted</ins> text.</p>
      <p>You can also use <kbd>keyboard text</kbd>, which sometimes is styled similarly to the <code>&lt;code&gt;</code> or <samp>samp</samp> tags. Even more specifically, there is a tag just for <var>variables</var>. Not to be mistaken with blockquotes
        below, the quote tag lets you denote something as <q>quoted text</q>. Lastly don't forget the sub (H<sub>2</sub>O) and sup (E = MC<sup>2</sup>) tags. </p>
    </article>
  </section>
  <hr>
  <section>
    <blockquote>
      <p>Blockquote: I quickly explained that many big jobs involve few hazards</p>
    </blockquote>
    <blockquote>
      <p>This is a mult-line blockquote with a cite reference. People think focus means saying yes to the thing you’ve got to focus on. But that’s not what it means at all. It means saying no to the hundred other good ideas that there are. You have to pick
        carefully. I’m actually as proud of the things we haven’tdone as the things I have done. Innovation is saying no to 1,000 things.
        <cite>Steve Jobs – Apple Worldwide Developers’ Conference, 1997</cite>
      </p>
    </blockquote>
  </section>
  <hr>
  <section>
    <ul>
      <li>Unordered List item one
        <ul>
          <li>Nested list item
            <ul>
              <li>Level 3, item one</li>
              <li>Level 3, item two</li>
              <li>Level 3, item three</li>
              <li>Level 3, item four</li>
            </ul>
          </li>
          <li>List item two</li>
          <li>List item three</li>
          <li>List item four</li>
        </ul>
      </li>
      <li>List item two</li>
      <li>List item three</li>
      <li>List item four</li>
    </ul>
    <hr>
    <ol>
      <li>List item one
        <ol>
          <li>List item one
            <ol>
              <li>List item one</li>
              <li>List item two</li>
              <li>List item three</li>
              <li>List item four</li>
            </ol>
          </li>
          <li>List item two</li>
          <li>List item three</li>
          <li>List item four</li>
        </ol>
      </li>
      <li>List item two</li>
      <li>List item three</li>
      <li>List item four</li>
    </ol>
  </section>
  <hr>
  <section>
    <address>1 Infinite Loop<br>
  Cupertino, CA 95014<br>
  United States</address>
  </section>
  <hr>
  <section>
    <pre>
pre {
  display: block;
  padding: 7px;
  background-color: #F5F5F5;
  border: 1px solid #E1E1E8;
  border-radius: 3px;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: Menlo, Monaco;
  line-height: 160%;
}</pre>
  </section>
  <hr />
  <figure>
    <img style="max-width: 100%" src="https://www.fillmurray.com/505/314">
    <figcaption>Fig1. A picture of Bill Murray from <a href="https://www.fillmurray.com/">fillmurray.com</a></figcaption>
  </figure>
</main>
`;

const mappings = {
  a: function Anchor(props: RendererProps) {
    const Link = RendererMappings.a;
    return (
      <Link
        {...props}
        onPress={() => {
          if (props.attrs && props.attrs.href) {
            Linking.openURL(props.attrs.href);
          }
        }}
      />
    );
  }
};

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <HTMLRenderer html={html} mappings={mappings} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingTop: Constants.statusBarHeight + 16
  }
});
