import { ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

const COMPOSABLE_PATTERN = /^use[A-Z]/;

type FunctionNode =
	| TSESTree.FunctionDeclaration
	| TSESTree.FunctionExpression
	| TSESTree.ArrowFunctionExpression;

function isFunctionNode(node: TSESTree.Node): node is FunctionNode {
	return (
		node.type === 'FunctionDeclaration' ||
		node.type === 'FunctionExpression' ||
		node.type === 'ArrowFunctionExpression'
	);
}

function getFunctionName(node: FunctionNode): string | undefined {
	if (node.type === 'FunctionDeclaration') {
		return node.id?.name;
	}

	const { parent } = node;
	if (parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
		return parent.id.name;
	}
	if (parent.type === 'Property' && parent.key.type === 'Identifier') {
		return parent.key.name;
	}
	if (parent.type === 'MethodDefinition' && !parent.computed && parent.key.type === 'Identifier') {
		return parent.key.name;
	}

	return undefined;
}

function isDefineStoreCallback(node: FunctionNode): boolean {
	const { parent } = node;
	if (parent.type !== 'CallExpression') {
		return false;
	}
	if (parent.callee.type !== 'Identifier' || parent.callee.name !== 'defineStore') {
		return false;
	}
	return parent.arguments[1] === node;
}

export const NoComposableOutsideSetupRule = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: 'problem',
		docs: {
			description:
				'Disallow calling composables (use*) outside of <script setup>, setup(), defineStore(), or another composable.',
		},
		messages: {
			noComposableOutsideSetup:
				'"{{ name }}" is a composable and must be called inside <script setup>, a setup() function, or another composable.',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		return {
			CallExpression(node) {
				if (node.callee.type !== 'Identifier') return;
				if (!COMPOSABLE_PATTERN.test(node.callee.name)) return;

				let current: TSESTree.Node | undefined = node.parent;
				while (current) {
					if (isFunctionNode(current)) {
						const name = getFunctionName(current);
						if (name && COMPOSABLE_PATTERN.test(name)) return;
						if (name === 'setup') return;
						if (isDefineStoreCallback(current)) return;
					}
					current = current.parent;
				}

				if (context.filename.endsWith('.vue')) return;

				context.report({
					node,
					messageId: 'noComposableOutsideSetup',
					data: { name: node.callee.name },
				});
			},
		};
	},
});
