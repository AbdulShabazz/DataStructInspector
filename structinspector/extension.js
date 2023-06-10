/*
// Desc: This is the main entry point for the extension.
const { TextDocuments, createConnection, ProposedFeatures } = require('vscode-languageserver');
TextDocuments;
createConnection;
ProposedFeatures;
*/
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

//let CPP_Memory_Model = "64-bit";

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

	// Use the extension's global state, which allows you to store and retrieve information that should persist across Visual Studio Code sessions.
	let globalState = context.globalState;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let ShowInformationWindow = vscode.commands.registerCommand('extension.ShowInformationWindow', function () {
		// The code you place here will be executed every time your command is executed
		let alignmentScheme = vscode.workspace.getConfiguration('memory_alignment').get('settings');
		// Display a message box to the user
		vscode.window.showInformationMessage(`StructInspector current settings: Memory Alignment - ${alignmentScheme}`);
		console.log(`StructInspector settings: Memory Alignment - ${alignmentScheme}`);
	});

	// Add the command to the list of disposables which are disposed when this extension is deactivated.
	context.subscriptions.push(ShowInformationWindow);

	let Enable32BitAlign = vscode.commands.registerCommand('extension.Enable32BitAlignment', function () {
		// Update the extension's global state (32-bit alignment)
		globalState.update('alignment', '32-bit');
		// Your logic here to show the memory layout.
		//CPP_Memory_Model = vscode.workspace.getConfiguration('memory_alignment').get('settings').alignment[1];
		// Display a message box to the user
		vscode.window.showInformationMessage('StructInspector is now using 32-bit memory alignment!');
	});

	// Add the command to the list of disposables which are disposed when this extension is deactivated.
	context.subscriptions.push(Enable32BitAlign);

	let Enable64BitAlign = vscode.commands.registerCommand('extension.Enable64BitAlignment', function () {
		// Update the extension's global state (32-bit alignment)
		globalState.update('alignment', '64-bit');
		// Your logic here to show the memory layout.
		//CPP_Memory_Model = vscode.workspace.getConfiguration('memory_alignment').get('settings').alignment[0];
		// Display a message box to the user
		vscode.window.showInformationMessage('StructInspector is now using 64-bit memory alignment!');
	});

	// Add the command to the list of disposables which are disposed when this extension is deactivated.
	context.subscriptions.push(Enable64BitAlign);

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
		+ a '>>' hover provider to provide struct loop iterator outputs for each language
		+ a '<<' hover provider to provide struct loop iterator outputs for each language
		+ Inheritance and virtual functions.
		+ Different kinds of members (static, const, etc).
		+ Nested classes/structs.
		+ Different memory alignments (32-bit, 64-bit, etc).
		+ Platform-specific behavior.
		+ Many other C/C++ language features.

	There are two (2) memory management ratings: Averegae (N/M > 1) and Excellent (N/M < 1) 
	where N is the number of bytes required in the struct,
	and M is the actual number of bytes reserved in the memory map.
	
	Please note that this is a very simplified version. A real implementation would have to take many more factors into account.
	*/

	// List of languages we want to support
	const languages = ['c', 'cpp','csharp', 'javascript','lua','python', 'typescript','vb', 'rust'];

	// Register a hover provider for each language
	for (const language of languages) {
		let registerHoverProviderLanguage = vscode.languages.registerHoverProvider(language, {
			provideHover(document, position, token) {
				token;
				const alignment = globalState.get('alignment', '64-bit'); // Use '64-bit' as the default
				const NBitBoundary = (alignment === '64-bit') ? 8 : 4;
				const word = document.getText(document.getWordRangeAtPosition(position));
				// This is a mock syntax tree for a C++ struct
				const mockTree = {
					name: 'MyStruct',
					type: 'struct',
					members: [
					{ type: 'int', name: 'z' },
					{ type: 'char', name: 'c' },
					{ type: 'double', name: 'f' },
					{ type: 'bool', name: 'b' },
					{ type: 'long', name: 'u' },
					],
				};
				
				// This is a mock function that just returns the above tree
				function getDeclarationUnderCursor(document, position) {
					return mockTree;
				}
				
				// Here's how you might implement calculateMemoryLayout:
				function calculateMemoryLayout(decl, alignment) {
					// This should be the parsed JSON provided in your question
					const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
					const platformConfig = config.platform_64bit;
				
					let layout = `${config.Memory_BoilerPlate}\n`;
					let totalSize = 0;
				
					for (const member of decl.members) {
					const memberConfig = platformConfig.data_type[member.type];
				
					layout += memberConfig.memory_footprint_top + '\n';
					layout += memberConfig.memory_footprint.replace('$', member.name) + '\n';
					layout += memberConfig.memory_footprint_bottom + '\n';
				
					totalSize += memberConfig.num_bytes;
					}
				
					// Append unused bytes when necessary to reach the next N-bit boundary
					if (totalSize % NBitBoundary !== 0) {
					const unusedBytes = NBitBoundary - (totalSize % NBitBoundary);
					const unusedConfig = config.unused;
				
					layout += unusedConfig.memory_footprint_top.repeat(unusedBytes) + '\n';
					layout += unusedConfig.memory_footprint.replace('#', unusedBytes).repeat(unusedBytes) + '\n';
					layout += unusedConfig.memory_footprint_bottom.repeat(unusedBytes) + '\n';
				
					totalSize += unusedBytes;
					}
				
					layout += `Total size: ${totalSize} bytes\n`;
				
					return layout;
				}

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
					} // End switch
					// Add the code block to the markdown string
					markdown.appendCodeblock(CodeBlock, language);
					// Add the memory layout to the markdown string
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
					// Return the markdown string
					return new vscode.Hover(markdown);
				} // End of if (word === 'StructInspector')
			} // End of provideHover
		}); // End of registerHoverProviderLanguage

		// Add the command to the list of disposables which are disposed when this extension is deactivated.
		context.subscriptions.push(registerHoverProviderLanguage);
	} // End of for (const language of languages)
} // End of activate

// This method is called when your extension is deactivated
function deactivate() {	
	console.log('Extension StructInspector now de-activated!');
}

// Export the functions
module.exports = {
	activate,
	deactivate
}
