# Disc Assessment Tool

The **DISC Assessment Tool** is a powerful, multilingual personality assessment platform based on the DISC methodology. Designed for global accessibility, this tool allows users to complete the DISC assessment in their preferred language, ensuring a personalized and inclusive experience. Whether for personal growth, team development, or HR use, the DISC Assessment Tool makes understanding personality types simple and accessible for everyone.

> **Forked from [rmcew/disc-tool](https://github.com/rmcew/disc-assessment-tool)**  
> This version includes major upgrades and enhancements. See [Changes in This Fork](#changes-in-this-fork) for details.

## Features

- **Multi-Language Support**: The tool supports a variety of languages. Language sets can be found in the `static/languages` directory. Each language is represented by a folder named with its language code (e.g., `en` for English, `ru` for Russian).

- **Easy Language Addition**: To add a new language, simply create a new folder in the `static/languages` directory with the appropriate language code and fill out each file that is present in other languages. Additionally, remember to update the new language code in the JSON object located at `static/languages/list.json`.

- **Export Results**: Once the assessment is completed, users can export their results to a PDF file, which can be downloaded and shared with others.

## Getting Started

Follow these steps to get started with the Disc Assessment Tool:

1. Clone the repository:

   ```bash
   git clone https://github.com/dyaskur/disc-assessment-test.git
   ```

2. Navigate to the project directory:

   ```bash
   cd disc-assessment-test
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Access the tool in your browser at `http://localhost:5179` and start taking the Disc assessment in your preferred language!

## Adding a New Language

To add a new language to the Disc Assessment Tool, follow these steps:

1. Create a new folder in `static/languages` with the language code (e.g., `fr` for French).

2. Fill out each file in the new folder that corresponds to the files present in other language folders.

3. Update the `static/languages/list.json` file by adding the new language code to the JSON object.

4. Restart the development server to see the new language option in the tool.


## Changes in This Fork
This fork includes the following upgrades and improvements:

- 🔼 Svelte upgraded from v3 to v4
- 🎨 DaisyUI upgraded from v2 to v3
- 🎨 Typescript upgraded from v4 to v5
- ✅ Dependency updates and improvements to development experience
- ⚡ Enhanced performance and bug fixes
- 🌐 Add Indonesian language support
- 🧪 Add feature tests using Playwright

## Coming Soon
- Add more input fields to allow users to provide more detailed responses
- Save session data to local storage to allow users to return to their previous assessment results
- Add a "Share" button to allow users to share their results with others
- Using backend to store and retrieve assessment results
- Upgrade to Svelte 5
- Upgrade to SvelteKit 2
- Upgrade to Vite 6
- Upgrade to DaisyUI 4
- Upgrade to Tailwind 4

If you’re migrating from the original repository, review these changes before deploying to production.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or a pull request in this repository.

## License

This project is licensed under the [MIT License](LICENSE).

---

We hope you find the **Disc Assessment Tool** helpful for providing an accessible way for users to take the DISC assessment in their preferred language. If you have any questions or need assistance, please don't hesitate to reach out to us or open an issue in this repository.
