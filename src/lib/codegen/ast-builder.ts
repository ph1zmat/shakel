/**
 * AST Builder utilities for code generation.
 * Provides helpers for building TypeScript/JSX AST nodes
 * used by NextJS and NestJS generators.
 */

import { Project, type SourceFile, VariableDeclarationKind } from 'ts-morph'

export class ASTBuilder {
	private project: Project

	constructor() {
		this.project = new Project({
			useInMemoryFileSystem: true,
			compilerOptions: {
				jsx: 4, // JsxEmit.ReactJSX
				target: 99, // ScriptTarget.ESNext
				module: 199, // ModuleKind.ESNext
				esModuleInterop: true,
			},
		})
	}

	createSourceFile(path: string, content = ''): SourceFile {
		return this.project.createSourceFile(path, content, { overwrite: true })
	}

	addDefaultImport(
		file: SourceFile,
		moduleSpecifier: string,
		defaultImport: string,
	): void {
		file.addImportDeclaration({
			defaultImport,
			moduleSpecifier,
		})
	}

	addNamedImports(
		file: SourceFile,
		moduleSpecifier: string,
		namedImports: string[],
	): void {
		file.addImportDeclaration({
			namedImports,
			moduleSpecifier,
		})
	}

	addDefaultExportFunction(
		file: SourceFile,
		name: string,
		body: string,
		params?: string,
	): void {
		file.addFunction({
			name,
			isDefaultExport: true,
			parameters: params ? [{ name: params, type: undefined }] : [],
			statements: body,
		})
	}

	addExportConst(file: SourceFile, name: string, initializer: string): void {
		file.addVariableStatement({
			isExported: true,
			declarationKind: VariableDeclarationKind.Const,
			declarations: [{ name, initializer }],
		})
	}

	getOutput(file: SourceFile): string {
		return file.getFullText()
	}
}

export const astBuilder = new ASTBuilder()
