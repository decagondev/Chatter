const { DecaChat } = require('deca-chat');
require('dotenv').config();
const readline = require('readline');

async function main() {
    const api_key = process.env.API_KEY;
    const base_url = process.env.BASE_URL;
    const chat_model = process.env.CHAT_MODEL;

  const chat = new DecaChat({
    apiKey: api_key,
    model: chat_model,
    baseUrl: base_url,
    maxTokens: 150,
    temperature: 0.7
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  chat.setSystemMessage('You are a helpful assistant who provides concise responses.');

  console.log('\nDecaChat Test Application');
  console.log('------------------------');
  console.log('Type your messages and press Enter. Type "quit" to exit.');
  console.log('Special commands:');
  console.log('  !clear - Clear conversation history');
  console.log('  !history - Show conversation history');
  console.log('------------------------\n');

  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase() === 'quit') {
        rl.close();
        return;
      }

      if (input === '!clear') {
        chat.clearConversation();
        chat.setSystemMessage('You are a helpful assistant who provides concise responses.');
        console.log('Conversation cleared.');
        askQuestion();
        return;
      }

      if (input === '!history') {
        const history = chat.getConversation();
        console.log('\nConversation History:');
        history.forEach((msg, i) => {
          console.log(`[${msg.role}]: ${msg.content}\n`);
        });
        askQuestion();
        return;
      }

      try {
        console.log('\nAssistant is typing...');
        const response = await chat.chat(input);
        console.log('Assistant:', response, '\n');
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error occurred');
      }

      askQuestion();
    });
  };

  askQuestion();
}

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

main().catch(console.error);