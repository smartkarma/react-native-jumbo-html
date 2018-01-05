/* @flow */

import type { RendererProps as _RendererProps } from "./utils/render-native";

export type RendererProps = _RendererProps;

export { default as HTMLRenderer } from "./renderers/html-renderer";
export { mappings as RendererMappings } from "./utils/render-native";
