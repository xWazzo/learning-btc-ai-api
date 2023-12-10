const { OpenAIEmbeddings } = require('langchain/embeddings/openai')
const { PineconeStore } = require('langchain/vectorstores/pinecone')
const { initPinecone } = require('../pinecone-client')
const makeChain = require('../makechain.js')

module.exports = controller = {
    chatQuery: async function(req, res, next) {
        console.log('funciona! :D', req.method);

        const { question, history } = req.body;

        console.log('question', question, history);

        //only accept post requests
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method not allowed' });
            return;
        }

        if (!question) {
            return res.status(400).json({ message: 'No question in the request' });
        }
        // OpenAI recommends replacing newlines with spaces for best results
        const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

        try {
            const pinecone = await initPinecone()
            console.log('pinecone: ', pinecone);
            const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
            console.log('index', index);

            /* create vectorstore*/
            const vectorStore = await PineconeStore.fromExistingIndex(
                new OpenAIEmbeddings({}),
                {
                    pineconeIndex: index,
                    textKey: 'text',
                    namespace: process.env.PINECONE_NAME_SPACE, //namespace comes from your config folder
                },
            );

            console.log('>> ================== before MakeChain ================== <<');
            //create chain
            const response = await makeChain(vectorStore, question);
            console.log('>> ================== AFTER chain ================== <<');
            //Ask a question using chat history
            // const response = await chain.call({
            //     question: sanitizedQuestion,
            //     chat_history: history || [],
            // });

            // const response = 'terminamos';
            console.log('response', response);
            res.status(200).json(response);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message || 'Something went wrong' });
        }
    }
}

