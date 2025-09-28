import OpenAI from "openai";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const token = process.env["GITHUB_PAT"];
const endpoint = process.env["AZURE_AI_ENDPOINT"] || "https://models.github.ai/inference";
const model = process.env["MODEL_NAME"] || "openai/gpt-4.1-mini";

export async function main() {
  if (!token) {
    throw new Error("GITHUB_PAT environment variable is required");
  }

  const client = new OpenAI({
    apiKey: token,
    baseURL: endpoint,
  });

  const response = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: "" },
      { role: "user", content: "What is the capital of France?" }
    ],
    temperature: 1,
    top_p: 1
  });

  console.log(response.choices[0].message?.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
