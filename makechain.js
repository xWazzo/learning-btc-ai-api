const { OpenAI } = require('langchain/llms/openai')
const { LLMChainExtractor } = require('langchain/retrievers/document_compressors/chain_extract')
const { ContextualCompressionRetriever } = require('langchain/retrievers/contextual_compression')

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer in markdown:`;

module.exports = makeChain = async(vectorStore, question) => {

	const model = new OpenAI({
		temperature: 0, // increase temepreature to get more creative answers
		modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
	});
	
	const baseCompressor = LLMChainExtractor.fromLLM(model);

	const retriever = new ContextualCompressionRetriever({
		baseCompressor,
		baseRetriever: vectorStore.asRetriever(),
	});
	console.log('>>>>>>>>>>>> retriever');
	
	const retrievedDocs = await retriever.getRelevantDocuments(
		question
	);

	return retrievedDocs

	// console.log('> retrievedDocs', retrievedDocs);

	// console.log('====================================');
	// console.log('retrievedDocs', { retrievedDocs });
	// console.log('====================================');
  

//   const chain = LLMChainExtractor.fromLLM(
//     model,
//     vectorstore.retriever,
//     {
//       qaTemplate: QA_PROMPT,
//       questionGeneratorTemplate: CONDENSE_PROMPT,
//       returnSourceDocuments: true, //The number of source documents returned is 4 by default
//     },
//   );
//   return chain;
};