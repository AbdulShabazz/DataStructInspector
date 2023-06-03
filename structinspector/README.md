# structinspector README

This is the README for your extension "structinspector". "structinspector" is a Visual Studio Code extension that allows you to inspect the structure of a C/C++ struct in the form of a JSON file.

## Features

To designate a struct to be inspected, use compact line comments which supply default values to each property and or attribute:

```cpp
struct A {
	int a; // test case: 5
	std::vector<std::string> b{}; // {"1", "2", "3"}
};
```

The extension will then track any and all changes made to the struct, which will be reflected when you hover over it as you progress through your code.

If you want to track a struct that is defined in a different file, you can use the `#include <filename>` directive or the `import [module.name]` to include the file or module name in your workspace.

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.1.0

Added features X, Y, and Z.

### 1.0.1

Fixed issue #.

### 1.0.0

Initial release of ...

---

## Working with Markdown

You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
