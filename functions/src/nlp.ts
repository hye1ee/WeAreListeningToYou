const language = require('@google-cloud/language');
// Creates a client
const client = new language.LanguageServiceClient();

export const getEntities = async (text: string) => {
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };
  const [result] = await client.analyzeEntitySentiment({ document });
  return result.entities;
}
