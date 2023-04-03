import * as vscode from 'vscode';
import OpenAI from 'openai-api';
import path = require('path');

require('dotenv').config();
// const openaiApiKey = process.env.OPENAI_API_KEY;
// const openaiApi = new OpenAI(openaiApiKey);

async function documentationSelectedBlock() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const selection = editor.selection;
	if (selection.isEmpty) {
		vscode.window.showErrorMessage("No code block selected.");
		return;
	}

	const document = editor.document;
	const startLine = selection.start.line;
	const endLine = selection.end.line;

	if (document.lineAt(startLine).text.trim() !== "{" ||
		document.lineAt(endLine).text.trim() !== "}") {
		vscode.window.showErrorMessage("Selected block is not a complete block.");
		return;
	}

	// const code = document.getText(selection);
	// const response = await openaiApi.completions.create({
	// 	engine: 'davinci-codex',
	// 	prompt: `Document the following code:\n\n${code}\n`,
	// 	max_tokens: 64,
	// 	n: 1,
	// 	stop: ['\n'],
	// 	temperature: 0.7,
	// });

	// const documentation = response.data.choices[0].text.trim();
	// editor.edit(editBuilder => {
	// 	editBuilder.insert(new vscode.Position(startLine, 0), `/**\n * ${documentation}\n */\n`);
	// });

	editor.edit(editBuilder => {
		editBuilder.insert(new vscode.Position(startLine, 0), "/**\n * Your documentation here\n */\n");
	});
}

async function documentationWholeFile() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const document = editor.document;
	const code = document.getText();

	// const response = await openaiApi.completions.create({
	// 	engine: 'davinci-codex',
	// 	prompt: `Document the following code:\n\n${code}\n`,
	// 	max_tokens: 64,
	// 	n: 1,
	// 	stop: ['\n'],
	// 	temperature: 0.7,
	// });

	// const documentation = response.data.choices[0].text.trim();
	// editor.edit(editBuilder => {
	// 	editBuilder.insert(new vscode.Position(0, 0), `/**\n * ${documentation}\n */\n`);
	// });

	editor.edit(editBuilder => {
		editBuilder.insert(new vscode.Position(0, 0), "/**\n * Your documentation here\n */\n");
	});
}

async function openSettings() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
		const settingsPath = path.join(workspaceFolders[0].uri.fsPath, '.vscode', 'settings.json');
		const settings = await vscode.workspace.openTextDocument(vscode.Uri.file(settingsPath));
		vscode.window.showTextDocument(settings);
	}
}

export function activate(context: vscode.ExtensionContext) {
	const settingsMenuItem = vscode.commands.registerCommand('extension.openSettings', openSettings);
	context.subscriptions.push(settingsMenuItem);

	const selectedBlockMenuItem = vscode.commands.registerCommand('extension.documentSelectedBlock', documentationSelectedBlock);
	context.subscriptions.push(selectedBlockMenuItem);

	const wholeFileMenuItem = vscode.commands.registerCommand('extension.documentWholeFile', documentationWholeFile);
	context.subscriptions.push(wholeFileMenuItem);

	context.subscriptions.push(vscode.commands.registerCommand('extension.openSettings', openSettings));
	const openSettingsCommand = vscode.commands.registerCommand('extension.openSettings', () => {
		openSettings();
	});

	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
	statusBarItem.text = '$(book) OpenAI';
	statusBarItem.command = 'extension.openSettings';

	context.subscriptions.push(openSettingsCommand, statusBarItem);

}
