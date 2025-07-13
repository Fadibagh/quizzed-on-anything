from flask import Flask, request, jsonify, render_template
from openai import OpenAI
import os

app = Flask(__name__)
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@app.route('/')
def home():
    return render_template('quiz-me.html')

@app.route('/quiz', methods=['POST'])
def generate_quiz():
    content = request.json
    quiz_topic = content.get('topic')
    
    if not quiz_topic:
        return jsonify({"error": "No quiz topic provided"}), 400

    messages = [
        {"role": "system", "content": "You are a multiple choice quiz maker, formulate the quiz you are given based on subject"},
        {"role": "system", "content": "For every subject you will give six multiple choice questions"},
        {"role": "system", "content": "Start each question with 'Question: ' and end with 'Answer: ' indicating what the correct answer is"},
        {"role": "user", "content": quiz_topic}
    ]

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=1000
    )

    print(completion.usage.total_tokens)

    quiz = str(completion.choices[0].message.content).split('\n\nQuestion: ')

    if len(quiz) < 6:
        return jsonify({"error": "Failed to generate enough questions"}), 500

    questions = []
    for block in quiz:
        parts = block.split("\nAnswer: ")
        question_and_options = parts[0]
        correct_answer = parts[1]

        question_lines = question_and_options.split('\n', 1)
        question = question_lines[0].replace('Question: ', '')
        options = question_lines[1] if len(question_lines) > 1 else ''
        questions.append({"question": question, "options": options, "correct_answer": correct_answer})

    return jsonify({"quiz": questions})

if __name__ == '__main__':
    app.run(debug=True) 