import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
	console.log(req.body.text);
	try {
		const completion = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: req.body.text,
			temperature: 0.5,
			max_tokens: 60,
			top_p: 1.0,
			frequency_penalty: 0.5,
			presence_penalty: 0,
			stop: [" You: ", " AI: "],
		});
		console.log(completion.data.choices[0].text);
		res.status(200).json({ result: completion.data });
	} catch {
		res.status(400).json({ error: "error" });
	}
}
