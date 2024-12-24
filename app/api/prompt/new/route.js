import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const POST = async (req) => {
  const { userId, prompt, tag } = await req.json(); // Corrected from req.JSON() to req.json()

  try {
    await connectToDB();
    const newPrompt = new Prompt({ creator: userId, prompt, tag }); // Included 'prompt' field

    await newPrompt.save();
    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to create new prompt.", {
      status: 500,
    });
  }
};
