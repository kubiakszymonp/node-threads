import * as ts from "typescript";
import type { TransformerExtras, PluginConfig } from "ts-patch";
import { printNode } from "./node-printing";

let importTable: Record<string, string>;

const transformer = (
  tsInstance: typeof ts,
  context: ts.TransformationContext,
  node: ts.Node
) => {
  // clear import table on new source file
  if (tsInstance.isSourceFile(node)) {
    importTable = {};
  }
  // for each import statement add to import table
  if (tsInstance.isImportDeclaration(node)) {
    const importPath = tsInstance.isStringLiteral(node.moduleSpecifier)
      ? node.moduleSpecifier.text
      : "";
    const importName = node.importClause?.namedBindings as ts.NamedImports;
    const importNameText = importName.elements[0].name.getText();
    importTable[importNameText] = importPath;
  }
  // if new Thread() expression is found, transform it
  if (
    tsInstance.isNewExpression(node) &&
    node.expression.getText() === "Thread" &&
    node.arguments?.length === 1
  ) {
    return threadObjectCreationNodeTransformator(
      tsInstance,
      node,
      context.factory,
      importTable
    );
  }
};

export const threadObjectCreationNodeTransformator = (
  tsInstance: typeof ts,
  node: ts.NewExpression,
  factory: ts.NodeFactory,
  importsObject: Record<string, string>
) => {
  const identifier = node.expression;
  const threadArgument = node.arguments?.at(0)!;

  let args: ts.Expression[] = [];

  if (tsInstance.isIdentifier(threadArgument)) {
    const identifierName = threadArgument.getText();
    const identifierImportPath = importsObject[identifierName];

    const propertyAccessExpressionIdentifier =
      factory.createIdentifier("module");
    const propertyAccessNameIdentifier =
      factory.createIdentifier(identifierName);
    const propertyAccessExpression = factory.createPropertyAccessExpression(
      propertyAccessExpressionIdentifier,
      propertyAccessNameIdentifier
    );

    const callExpression = factory.createCallExpression(
      propertyAccessExpression,
      undefined,
      [factory.createIdentifier("arg")]
    );

    const moduleParameter = factory.createParameterDeclaration(
      undefined,
      undefined,
      factory.createIdentifier("module"),
      undefined,
      factory.createKeywordTypeNode(tsInstance.SyntaxKind.AnyKeyword)
    );

    const argsParameter = factory.createParameterDeclaration(
      undefined,
      undefined,
      factory.createIdentifier("arg"),
      undefined,
      factory.createKeywordTypeNode(tsInstance.SyntaxKind.AnyKeyword)
    );

    const firstArg = factory.createArrowFunction(
      undefined,
      undefined,
      [moduleParameter, argsParameter],
      undefined,
      undefined,
      callExpression
    );

    args.push(firstArg);

    const relativePathNArrayExp = factory.createArrayLiteralExpression([
      factory.createIdentifier("__dirname"),
      factory.createStringLiteral(identifierImportPath),
    ]);

    args.push(relativePathNArrayExp);
    const exp = factory.createNewExpression(identifier, undefined, args);
    return exp;
  }
  return node;
};

export default (
  program: ts.Program,
  pluginConfig: PluginConfig,
  { ts: tsInstance }: TransformerExtras
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
      //printNode(transformedSource, tsInstance);
      return transformedSource;
    };
  };
};
