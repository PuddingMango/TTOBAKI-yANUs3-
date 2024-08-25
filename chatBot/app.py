import logging
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from utils.speech_recognition import recognize_speech
from utils.openai_interaction import get_openai_response
from utils.convert_korean_age import convert_korean_age_to_number
from utils.name_extraction import extract_name_from_text
from config import OPENAI_API_KEY
import openai

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 로거 설정
conversation_logger = logging.getLogger('conversationLogger')
conversation_logger.setLevel(logging.INFO)
handler = logging.FileHandler('conversation.log')
handler.setFormatter(logging.Formatter('%(asctime)s - %(message)s'))
conversation_logger.addHandler(handler)

openai.api_key = OPENAI_API_KEY

@app.route('/speech', methods=['POST'])
def speech():
    try:
        data = request.json
        conversation_history = data.get('conversation_history', [])
        stage = data.get('stage', 'greeting')

        if not conversation_history or not conversation_history[-1].get('content'):
            return jsonify({"response": "음성 입력을 인식하지 못했습니다. 다시 시도해주세요.", 
                            "logs": [], 
                            "conversation_history": conversation_history, 
                            "stage": stage})

        user_input = conversation_history[-1]['content']

        if stage == 'greeting':
            bot_message = "안녕? 너는 누구야?"
            stage = 'name'
        elif stage == 'name':
            bot_message = f"{extract_name_from_text(user_input)}, 반가워! 너는 몇 살이야?"
            stage = 'age'
        elif stage == 'age':
            age = convert_korean_age_to_number(user_input.strip())
            if age is None:
                bot_message = "몇 살인지 다시 알려줘 !"
                stage = 'age' 
            else:
                bot_message = f"{age}살이라니 멋지다! 나는 어떤 친구가 되어줄까?"
                stage = 'friend_type'
        elif stage == 'friend_type':
            bot_message = f"좋아! 어떤 대화를 할까? 아무거나 말해줘"
            stage = 'conversation'
        else:
            bot_message = get_openai_response(conversation_history) 

        # 로그 기록 및 응답 반환
        conversation_logger.info(f"유저: {user_input} / 챗봇: {bot_message}")
        conversation_history.append({"role": "assistant", "content": bot_message})

        return jsonify({"response": bot_message, 
                        "logs": [], 
                        "conversation_history": conversation_history, 
                        "stage": stage})

    except Exception as e:
        conversation_logger.error(f"오류 발생: {e}")
        return jsonify({"response": "서버에서 문제가 발생했습니다. 다시 시도해주세요."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)