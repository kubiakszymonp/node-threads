import * as ts from "typescript";
import type { TransformerExtras, PluginConfig } from "ts-patch";
import { printNode } from "./utils";

export const simpleSourceTransformer = (
  program: ts.Program,
  pluginConfig: PluginConfig,
  { ts: tsInstance }: TransformerExtras,
  transformer: (
    tsInstance: typeof ts,
    context: ts.TransformationContext,
    node: ts.Node
  ) => ts.Node | void
) => {
  return (ctx: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      function visit(node: ts.Node): ts.Node {
        const transformation = transformer(tsInstance, ctx, node);
        return transformation
          ? transformation
          : tsInstance.visitEachChild(node, visit, ctx);
      }
      const transformedSource = tsInstance.visitNode(
        sourceFile,
        visit
      ) as ts.SourceFile;
      printNode(transformedSource, tsInstance);
      return transformedSource;
    };
  };
};
