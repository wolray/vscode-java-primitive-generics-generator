import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const transformer: Transformer = new Transformer();
	context.subscriptions.push(vscode.commands.registerCommand('intTransformer.selection', () =>
		fromSelection(transformer)));
	context.subscriptions.push(vscode.commands.registerCommand('intTransformer.file', async () =>
		fromFile(transformer)));
}

async function fromSelection(transformer: Transformer) {
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	let seperation = await vscode.window.showInputBox({
		placeHolder: 'separator (newline as default)'
	}) || '\n';
	let src = editor.document.getText(editor.selection);
	let res: string[] = [];
	res.push(seperation);
	res.push(transformer.toDouble(src));
	res.push(seperation);
	res.push(transformer.toLong(src));
	let end = editor.selection.end;
	let out = res.join('');
	editor.edit(builder => builder.replace(end, out));
}

function fromFile(transformer: Transformer) {
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	let fs = require('fs');
	let src = editor.document.getText();
	let doubleFilePath = transformer.toDouble(editor.document.fileName);
	fs.writeFileSync(doubleFilePath, transformer.toDouble(src), 'utf8');
	let longFilePath = transformer.toLong(editor.document.fileName);
	fs.writeFileSync(longFilePath, transformer.toLong(src), 'utf8');
}

class Transformer {
	readonly low = /(?<![a-z])int(?= [a-z][a-z]+ )/g;
	readonly cap = /(Integer)|(Int)/g;

	toDouble(intSource: string): string {
		return intSource.replace(this.low, 'double').replace(this.cap, 'Double');
	}

	toLong(intSource: string): string {
		return intSource.replace(this.low, 'long').replace(this.cap, 'Long');
	}
}

export function deactivate() { }
