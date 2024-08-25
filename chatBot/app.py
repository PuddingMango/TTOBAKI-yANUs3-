import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 로깅 설정
logging.basicConfig(filename='conversation.log', level=logging.INFO, format='%(asctime)s - %(message)s')

# OpenAI API 키 설정
from config import OPENAI_API_KEY
openai.api_key = OPENAI_API_KEY

@app.route('/speech', methods=['POST'])
def speech():
    data = request.json
    user_response = data.get('text')
    conversation_stage = data.get('stage')

    response = {"response": "", "stage": conversation_stage}

    if conversation_stage == "greeting":
        response["response"] = "안녕? 너는 누구야?"
        response["stage"] = "name"
    
    elif conversation_stage == "name":
        response["response"] = f"{user_response}, 반가워! 너는 몇 살이야?"
        response["stage"] = "age"

    elif conversation_stage == "age":
        response["response"] = f"{user_response}살이라니 멋지다! 나는 어떤 친구가 되어줄까?"
        response["stage"] = "friend_type"

    elif conversation_stage == "friend_type":
        response["response"] = f"좋아! 나는 너의 {user_response}가 될게!"
        response["stage"] = "conversation"

    else:
        # 대화 지속
        conversation_history = data.get('conversation_history', [])
        conversation_history.append({"role": "user", "content": user_response})

        openai_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=conversation_history
        )

        bot_message = openai_response['choices'][0]['message']['content']
        conversation_history.append({"role": "assistant", "content": bot_message})
        
        response["response"] = bot_message
        response["conversation_history"] = conversation_history

    # 대화 내용을 로그 파일에 기록
    logging.info(f"User ({conversation_stage}): {user_response}")
    logging.info(f"Bot: {response['response']}")
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5001)