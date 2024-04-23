const language = require('@google-cloud/language').v2;
// Creates a client
const client = new language.LanguageServiceClient();

/**
 * TODO(developer): Uncomment the following line to run this code.
 */

export const getEntities = async (text: string) => {
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };
  const [result] = await client.analyzeEntities({ document });
  return result.entities;
}
