import * as vscode from 'vscode';
import path = require('path');

const { Configuration, OpenAIApi } = require("openai");

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

	const documentation = await getDocumentationTextFromOpenAI(document.getText(selection));

	if (documentation !== undefined) {
		editor.edit(editBuilder => {
			editBuilder.insert(new vscode.Position(startLine, 0), "/**\n * " + documentation + "\n */\n");
		});
	}
}

async function documentationWholeFile() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const document = editor.document;
	const code = document.getText();

	const documentation = await getDocumentationTextFromOpenAI(code);

	if (documentation !== undefined) {
		editor.edit(editBuilder => {
			editBuilder.insert(new vscode.Position(0, 0), "/**\n * " + documentation + "\n */\n");
		});
	}
}

async function getDocumentationTextFromOpenAI(textToBeDocumented: string) {
	let openaiApiKey = vscode.workspace.getConfiguration().get('openaiApiKey') as string;
	const configuration = new Configuration({
		apiKey: openaiApiKey,
	});
	const openaiApi = new OpenAIApi(configuration);
	const aiModel = vscode.workspace.getConfiguration().get('aiModel') as string;

	if (openaiApiKey !== '') {
		vscode.window.showInformationMessage("Requesting documentation from OpenAI with using " + aiModel + " model");

		const response = await openaiApi.createCompletion({
			model: aiModel,
			prompt: `Document the following code in short words\n\n${textToBeDocumented}\n\n`,
			max_tokens: 64,
			n: 1,
			temperature: 0.3
		});

		let documentation = response.data.choices[0].text.trim();
		documentation = documentation.replace(/\.\s/g, ".\n * ");
		return documentation;
	}
	else {
		vscode.window.showInformationMessage("OpenAI key not found, please set it through settings");
	}
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
	const selectedBlockMenuItem = vscode.commands.registerCommand('extension.documentSelectedBlock', documentationSelectedBlock);
	context.subscriptions.push(selectedBlockMenuItem);

	const wholeFileMenuItem = vscode.commands.registerCommand('extension.documentWholeFile', documentationWholeFile);
	context.subscriptions.push(wholeFileMenuItem);

	const openSettingsCommand = vscode.commands.registerCommand('extension.openSettings', () => {
		openSettings();
	});
	context.subscriptions.push(openSettingsCommand);

	let openaiApiKey = vscode.workspace.getConfiguration().get('openaiApiKey') as string;

	if (openaiApiKey === '') {
		vscode.window.showInputBox({
			prompt: "Enter OpenAI API Key",
			value: ""
		}).then((inputValue) => {
			if (inputValue !== undefined) {
				const config = vscode.workspace.getConfiguration();
				config.update('openaiApiKey', inputValue, vscode.ConfigurationTarget.Global);
				vscode.window.showInformationMessage('OpenAI API key saved successfully!');
			}
		});
	}
}
