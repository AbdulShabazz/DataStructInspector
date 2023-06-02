// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "structinspector" is now activated!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let ShowInformationWindow = vscode.commands.registerCommand('structinspector.ShowInformationWindow', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from StructInspector!');
	});

	context.subscriptions.push(ShowInformationWindow);

	// List of languages we want to support
	const languages = ['c', 'cpp','csharp', 'javascript','lua','python', 'typescript','vb', 'rust'];

	// Register a hover provider for each language
	for (const language of languages) {
		let registerHoverProviderLanguage = vscode.languages.registerHoverProvider(language, {
			provideHover(document, position, token) {
				token;
				const word = document.getText(document.getWordRangeAtPosition(position));
				if (word === 'StructInspector') {
					let markdown = new vscode.MarkdownString();
					markdown.appendText('StructInspector: The current state of your data structure');
					switch (language) {
						case 'c':
							markdown.appendCodeblock('struct MyStruct {\n\tint key;\n\tchar value;\n};', language);
							break;
						case 'cpp':
							markdown.appendCodeblock('struct MyStruct {\n\tint key;\n\tchar value;\n};', language);
							break;
						case 'csharp':
							markdown.appendCodeblock('public class MyStruct {\n\tpublic int key;\n\tpublic char value;\n}', language);
							break;
						case 'javascript':
							markdown.appendCodeblock('let MyStruct = {\n\t"key":"value"\n};', language);
							break;
						case 'lua':
							markdown.appendCodeblock('local MyStruct = {\n\tkey = "value"\n}', language);
							break;
						case 'python':
							markdown.appendCodeblock('class MyStruct:\n\tdef __init__(self):\n\t\tself.key = "value"', language);
							break;
						case 'rust':
							markdown.appendCodeblock('struct MyStruct {\n\tkey: String,\n\tvalue: String\n}', language);
							break;
						case 'vb':
							markdown.appendCodeblock('Public Class MyStruct\n\tpublic key As Integer\n\tpublic value As Char\nEnd Class', language);
							break;
					}
					return new vscode.Hover(markdown);
				}
			}
		});

		context.subscriptions.push(registerHoverProviderLanguage);
	}
}

// This method is called when your extension is deactivated
function deactivate() {	
	console.log('Extension "structinspector" is now de-activated!');
}

module.exports = {
	activate,
	deactivate
}
