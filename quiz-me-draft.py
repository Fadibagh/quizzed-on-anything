from openai import OpenAI

client = OpenAI()

messages = [{"role": "system", "content": "You are a multiple choice quiz maker, Formulate the quiz you are given based on subject"},
            {"role": "system", "content": "For every subject you will give five multiple choice questions"},
            {"role": "system", "content": "Start each question with 'Question: ' and end with 'Answer: ' indicating what the correct answer is"}]

quiz_topic = input("What do you want to be quized on: ")
messages.append({"role": "user", "content": quiz_topic})

while (True):

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=800
        )

    input_tokens = completion.usage.total_tokens
    print(f"Total tokens used (input + output): {input_tokens}")
    
    quiz = str(completion.choices[0].message.content)
    
    quiz = quiz.split('\n\nQuestion: ')

    if len(quiz) < 5:
        continue
    else:
        break

questions = []
for block in quiz:
    parts = block.split("\nAnswer: ")
    question_and_options = parts[0]
    correct_answer = parts[1]

    question_lines = question_and_options.split('\n',1)
    question = question_lines[0]
    options = question_lines[1] if len(question_lines) > 1 else ''
    questions.append([question, options, correct_answer[0]])


i = 1
correct_answer_counter = 0

for question in questions:
    print(i, ':', question[0])
    print(question[1])
    i += 1
    user_answer = input("Your Answer: ")
    if question[2].lower() == user_answer.lower():
        correct_answer_counter += 1
        print("Thats correct!")
    else:
        print("Thats wrong, the answer was:", question[2])

    print("---")

print(correct_answer_counter)