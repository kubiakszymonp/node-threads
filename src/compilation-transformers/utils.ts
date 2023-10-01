import type * as ts from "typescript";

export const getNodeRepresentation = (node: ts.Node, tsInstance: typeof ts) => {
  const printer = tsInstance.createPrinter({
    newLine: tsInstance.NewLineKind.LineFeed,
  });

  const printedNode = printer.printNode(
    tsInstance.EmitHint.Unspecified,
    node,
    null as any
  );

  return printedNode;
};

export const printNode = (node: ts.Node, tsInstance: typeof ts) => {
  console.log(getNodeRepresentation(node, tsInstance));
};
