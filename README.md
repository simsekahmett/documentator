# Documentator
Documentator is a Visual Studio Code extension that allows you to easily create documentation for your code. With Documentator, you can generate documentation for a selected block of code or an entire file with just a few clicks.

![Right click context menu screenshot](screenshots/context_menu.jpg?raw=true)

## Features
* Create code documentation for a selected block of code
* Create code documentation for an entire file
* Use OpenAI API to generate documentation automatically
* Customize the OpenAI API key through the extension settings
* Display the generated documentation in a popup or as a comment in your code
* Easy to use and intuitive user interface

## Getting Started
To use Documentator, follow these steps:

1. Install the extension from the Visual Studio Code marketplace
2. Open a file in Visual Studio Code
3. Select the block of code you want to document
4. Right-click on the selection and choose "Document selected block" from the context menu
5. If you have set your OpenAI API key in the extension settings, you will see a popup with the generated documentation. If not, you will be prompted to set your API key first.
6. Alternatively, you can also document the entire file by right-clicking on the editor and choosing "Document file" from the context menu.

![Screen recording for documenting file](screenshots/whole_file.gif?raw=true)

![Screen recording for documenting selected block](screenshots/selected_block.gif?raw=true)

## Extension Settings
The Documentator extension provides the following settings:

* `documentator.openaiApiKey`: The API key for the OpenAI API. You can get your API key by creating an account on the OpenAI website.
* `documentator.aiModel`: The OpenAI model to be used for getting documentation prompt. (text-davinci-003 as default)

To customize these settings, open the Visual Studio Code settings editor by going to "File" > "Preferences" > "Settings" or by pressing `Ctrl` + `,` (Windows and Linux) or `Cmd` + `,` (macOS). Then, search for "Documentator" and edit the desired setting.

![Settings menu screenshot](screenshots/settings.jpg?raw=true)

## Limitations
* The extension requires an internet connection to use the OpenAI API
* The OpenAI API has a rate limit and may be subject to usage fees
* The generated documentation may not always be accurate or complete

## Feedback and Contributions
If you encounter any issues with the extension or have suggestions for new features, please submit an issue on the extension's GitHub repository.

If you would like to contribute to the extension, feel free to fork the repository and submit a pull request with your changes.

## License
This extension is licensed under the MIT License.