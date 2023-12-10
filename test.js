const { Pinecone } = require('@pinecone-database/pinecone')
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
})

try {
    const describeIndex = await pinecone.describeIndex(process.env.PINECONE_INDEX);
    console.log('describeIndex', describeIndex);
    res.json(describeIndex);
} catch (error) {
    console.error('Error al describir el índice:', error);
    res.status(500).send('Error en el servidor');
}