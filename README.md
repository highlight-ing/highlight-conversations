# Highlight Conversations

Highlight Conversations is an example NextJS application that demonstrates how to build apps using the Highlight app runtime. This project showcases the capabilities of local Automatic Speech Recognition (ASR) and Highlight's built-in Language Model (LLM) while prioritizing user privacy.

## Features

- **Local Speech-to-Text Conversion**: Utilizes local ASR to convert speech to text from both audio input and system audio.
- **Automatic Transcription**: Delivers new transcripts every 30 seconds and saves them automatically after 30 seconds of inactivity.
- **Privacy-Focused**: Ensures all audio data is processed and stored locally, demonstrating Highlight's commitment to user privacy.
- **AI-Powered Summaries**: Uses Highlight's built-in LLM to generate summaries and topics from conversations upon user request.
- **Highlight Runtime API**: Showcases the Highlight Runtime API, enabling developers to easily interact with the Highlight runtime and context.

## Getting Started

To run Highlight Conversations, follow these steps:

1. Install dependencies: `npm install`
2. Ensure Highlight app is running:
- Launch the Highlight app
- Select "Local Development" option
- This will configure Highlight to listen on `localhost:3000`

Note: Conversations must run inside the Highlight app to utilize the Highlight runtime API.

3. Start the development server: `npm run dev`

Conversations should now be running and accessible through the Highlight app.

## Supabase

The sharing functionality for Highlight Conversations is powered by Supabase. On PRs, a GitHub action will automatically update the Supabase types along with creating migrations for any changes from Highlight's Supabase account.

To start a local Supabase instance, run:

```bash
npx supabase start
```

This will run a Supabase docker container and start a local Supabase instance. Use the outputted values to update the `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in a `.env` file based on the `.env.sample` file.


## Contributing

We welcome contributions to Highlight Conversations! If you'd like to contribute, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix e.g. `git checkout -b feature/my-awesome-feature` or `git checkout -b fix/squash-the-bug`
3. Make your changes and commit them with clear, descriptive messages
4. Push your changes to your fork
5. Submit a pull request to the main repository

Please ensure your code adheres to our coding standards and includes appropriate tests.

## Support

[Highlight Developer Documentation](https://docs.highlight.ing/documentation/introduction)

[Join our Discord community!](https://discord.gg/qzbxtnF6) We're here to assist you and discuss all things Highlight.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
