import * as vscode from 'vscode';
import { writeFileSync } from 'fs';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('javaPrimitiveGenericsGenerator.firstToInt', async () => run(true)));
	context.subscriptions.push(vscode.commands.registerCommand('javaPrimitiveGenericsGenerator.thenToDoubleLong', async () => run(false)));
}

function run(toInt: boolean) {
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	let file = editor.document.fileName;
	let code = editor.document.getText();
	if (toInt) {
		writeIntFile(file, code);
	} else {
		writeDoubleLongFile(file, code, 'Double');
		writeDoubleLongFile(file, code, 'Long');
	}
}

function writeIntFile(file: string, code: string) {
	let newFile = file.replace(/(\w+\.java)/, 'Int$1');
	let newCode = toInt(code);
	writeFileSync(newFile, newCode, 'utf8');
}

function writeDoubleLongFile(file: string, code: string, capital: string) {
	let newFile = toDoubleLong(file, capital);
	let newCode = toDoubleLong(code, capital);
	writeFileSync(newFile, newCode, 'utf8');
}

function toInt(code: string): string {
	let newlineFound = code.match(/\r?\n|\r/);
	if (newlineFound === null) {
		return code;
	}
	let classRegex = /\bclass\s+(\w+)(<N>)?/g;
	let classFound;
	let set = new Set();
	while (classFound = classRegex.exec(code)) {
		set.add(classFound[1]);
	}
	for (let name of set) {
		code = code.replace(new RegExp(`\\b${name}\\b(<N?>)?`, 'g'), `Int${name}`);
	}
	code = code.replace(/(\s*(\/\/.*?(\r?\n|\r)))+/g, newlineFound[0]);

	return code
		.replace(/(\bimport\s+java\.util\.function\.\w+;(\r?\n|\r))+/, `import java.util.function.*;${newlineFound[0]}`)
		.replace(/\b(static)\s*<N>\s*/g, '$1 ')
		.replace(/\b(UnaryOperator)<N>/g, 'Int$1')
		.replace(/\b(BinaryOperator)<N>/g, 'Int$1')
		.replace(/\b(Supplier)<N>/g, 'Int$1')
		.replace(/\b(Consumer)<N>/g, 'Int$1')
		.replace(/\b(Predicate)<N>/g, 'Int$1')
		.replace(/\b(Function)<(\w+),\s*N>/g, 'ToInt$1<$2>')
		.replace(/\b(BiFunction)<(\w+),\s*(\w+),\s*N>/g, 'ToInt$1<$2, $3>')
		.replace(/\b(get)\(\)/g, '$1AsInt()')
		.replace(/\b(apply)\(/g, '$1AsInt(')
		.replace(/<N>/g, '<Integer>')
		.replace(/\bN(\.|::)/g, 'Integer$1')
		.replace(/\bN\b/g, 'int')
		;
}

function toDoubleLong(code: string, capital: string): string {
	return code
		.replace(/\bint(?=\s+\w{2,})/g, capital.toLowerCase())
		.replace(/\bInteger\b/g, capital)
		.replace(/\bInt(?=\w+)/g, capital)
		.replace(/(?<=\bTo)Int(?=\w+)/g, capital)
		.replace(/(?<=\bgetAs)Int(?=\(\))/g, capital)
		.replace(/(?<=\bapplyAs)Int(?=\()/g, capital)
		;
}

export function deactivate() { }
