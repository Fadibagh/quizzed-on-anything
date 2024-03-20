from openai import OpenAI

client = OpenAI()

messages = [{"role": "system", "content": "You are a multiple choice quiz maker"},
            {"role": "system", "content": "Given a quiz subject, find 5 suitable MCQs to ask me"},
            {"role": "system", "content": "For every topic you will give 5 multiple choice questions, you start each question with Question: "},
            {"role": "system", "content": "For every question you give back you will end the question with Answer: , and say what letter the answer was"}]

quiz_topic = input("What do you want to be quized on: ")

messages.append({"role": "user", "content": quiz_topic})
completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=messages)


quiz = str(completion.choices[0].message.content)


# quiz = "Great! Let's start with some questions on data structures and algorithms. \n\nQuestion: What data structure uses Last In, First Out (LIFO) principle?\nA) Queue\nB) Stack\nC) Linked List\nD) Tree\nAnswer: B\n\nQuestion: Which sorting algorithm has the worst-case time complexity of O(n^2)?\nA) Merge Sort\nB) Insertion Sort\nC) Quick Sort\nD) Heap Sort\nAnswer: B\n\nQuestion: In which data structure does each element point to the next element in the sequence?\nA) Array\nB) Tree\nC) Queue\nD) Linked List\nAnswer: D\n\nQuestion: What is the time complexity of binary search in a sorted array of length n?\nA) O(n)\nB) O(log n)\nC) O(n log n)\nD) O(1)\nAnswer: B\n\nQuestion: Which data structure is typically used in Depth-First Search traversal of a graph?\nA) Queue\nB) Stack\nC) Priority Queue\nD) Heap\nAnswer: B."

print(quiz)


quiz = quiz.split('\n\nQuestion: ')
quiz.pop(0)

questions = []
for block in quiz:
    print("Block", block)
    parts = block.split("\nAnswer: ")
    question_and_options = parts[0]
    correct_answer = parts[1]

    question_lines = question_and_options.split('\n',1)
    question = question_lines[0]
    options = question_lines[1] if len(question_lines) > 1 else ''
    questions.append([question, options, correct_answer])


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