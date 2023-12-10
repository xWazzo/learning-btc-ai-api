const { Pinecone } = require('@pinecone-database/pinecone');

module.exports = controller = {
  initPinecone: async function() {
    try {
      const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT,
      });
  
      return pinecone;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to initialize Pinecone Client');
    }
  }
}