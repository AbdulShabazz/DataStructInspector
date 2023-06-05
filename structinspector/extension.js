/*
// Desc: This is the main entry point for the extension.
const { TextDocuments, createConnection, ProposedFeatures } = require('vscode-languageserver');
TextDocuments;
createConnection;
ProposedFeatures;
*/
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
		vscode.window.showInformationMessage('StructInspector is now activated!');
	});

	/**
		NOTE: There are two ways to access the current document via the vscode APIs:

			1. Direct API access to the current document (eg. vscode.languages.registerHoverProvider(params, callback)) 
				Used to register a callback function for a specific language, this method is not portable across languages, 
				even minor versions of the same language, or other Microsoft products.

			2. The Language Server Protocol (LSP) client/server framework, which makes the extension more portable across languages and Microsoft products.
				(ref: https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)

				
			1. vscode.window.activeTextEditor.document
			2. vscode.workspace.textDocuments
			3. vscode.workspace.openTextDocument(params)
			4. vscode.TextDocument
	*/
	/**
	 Todo: Add the following features:
		Add a '>>' hover provider to provide struct loop iterator outputs for each language
		Add a '<<' hover provider to provide struct loop iterator outputs for each language

			There are two (2) memory management ratings: Averegae (N/M > 1) and Excellent (N/M < 1) 
			where N is the number of bytes required in the struct,
			and M is the actual number of bytes reserved in the memory map.
	*/

	// Add the command to the list of disposables which are disposed when this extension is deactivated.
	context.subscriptions.push(ShowInformationWindow);

	// List of languages we want to support
	const languages = ['c', 'cpp','csharp', 'javascript','lua','python', 'typescript','vb', 'rust'];

	// Register a hover provider for each language
	for (const language of languages) {
		let registerHoverProviderLanguage = vscode.languages.registerHoverProvider(language, {
			provideHover(document, position, token) {
				token;
				const word = document.getText(document.getWordRangeAtPosition(position));
				let CodeBlock = '';
				if (word === 'StructInspector') {
					let markdown = new vscode.MarkdownString();
					markdown.appendText('StructInspector: The current state of your data structure');
					switch (language) {
						case 'c':
							CodeBlock = 'struct MyStruct {\n\tint key;\n\tchar value;\n};';
							break;
						case 'cpp':
							CodeBlock = 'struct MyStruct {\n\tint key;\n\tchar value;\n};';
							break;
						case 'csharp':
							CodeBlock = 'public class MyStruct {\n\tpublic int key;\n\tpublic char value;\n}';
							break;
						case 'javascript':
							CodeBlock = 'let MyStruct = {\n\t"key":"value"\n};';
							break;
						case 'lua':
							CodeBlock = 'local MyStruct = {\n\tkey = "value"\n}';
							break;
						case 'python':
							CodeBlock = 'class MyStruct:\n\tdef __init__(self):\n\t\tself.key = "value"';
							break;
						case 'rust':
							CodeBlock = 'struct MyStruct {\n\tkey: String,\n\tvalue: String\n}';
							break;
						case 'vb':
							CodeBlock = 'Public Class MyStruct\n\tpublic key As Integer\n\tpublic value As Char\nEnd Class';
							break;
					}
					markdown.appendCodeblock(CodeBlock, language);
					markdown.appendCodeblock('Memory Layout (in bytes):', language);
					markdown.appendCodeblock('Rating: Excellent', language);
					markdown.appendCodeblock('0       1       2       3       4       5       6       7         8', language);
					markdown.appendCodeblock('|-------|-------|-------|-------|-------|-------|-------|---------|', language);
					markdown.appendCodeblock('|char(1)|    short(2)   |            int(4)             |unused(1)|', language);
					markdown.appendCodeblock('|-------|-------|-------|-------|-------|-------|-------|---------|', language);
					markdown.appendCodeblock('|                            double(8)                            |', language);
					markdown.appendCodeblock('|-------|-------|-------|-------|-------|-------|-------|---------|', language);
					markdown.appendCodeblock('\n', language);
					markdown.appendCodeblock('c - char (1 byte)', language);
					markdown.appendCodeblock('s - short (2 bytes)', language);
					markdown.appendCodeblock('i - int (4 bytes)', language);
					markdown.appendCodeblock('d - double (8 bytes)', language);
					markdown.appendCodeblock('unused - padding (1 byte)', language);
					return new vscode.Hover(markdown);
				}
			}
		});

		// Add the command to the list of disposables which are disposed when this extension is deactivated.
		context.subscriptions.push(registerHoverProviderLanguage);
	}
}

// This method is called when your extension is deactivated
function deactivate() {	
	console.log('Extension StructInspector now de-activated!');
}

// Export the functions
module.exports = {
	activate,
	deactivate
}
