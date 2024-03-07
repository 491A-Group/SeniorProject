import openai
import os

# Set up your OpenAI API key

os.environ["OPENAI_API_KEY"] = "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"
openai.api_key = os.environ["OPENAI_API_KEY"]
model_engine = "gpt-3.5-turbo-0125"


def ask_chat(prompt):
    response = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )
    message = response.choices[0].text
    return message.strip()


print("Welcome to the chatbot! Type 'bye', 'goodbye', 'exit', or 'quit' to end the conversation.")

while True:
    user_input = input("> ")
    if user_input.lower() in ["bye", "goodbye", "exit", "quit"]:
        print("Goodbye!")
        break
    prompt = f"You: {user_input}\nChatGPT:"
    response = ask_chat(prompt)
    print(response)
