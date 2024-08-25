import uuid
import os
import requests
import logging
from datetime import datetime
from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
from utils.speech_recognition import recognize_speech
from utils.openai_interaction import get_openai_response
from utils.convert_korean_age import convert_korean_age_to_number
from utils.name_extraction import extract_name_from_text
from utils.prompt_utils import get_preprompt_for_situation
from config import OPENAI_API_KEY, SK_API_KEY
import openai

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 로거 설정
conversation_logger = logging.getLogger('conversationLogger')
conversation_logger.setLevel(logging.INFO)
handler = logging.FileHandler('logs/conversation.log')
handler.setFormatter(logging.Formatter('%(asctime)s - %(message)s'))
conversation_logger.addHandler(handler)

openai.api_key = OPENAI_API_KEY

# TTS 요청 함수
def generate_tts(text):
    url = "https://apis.openapi.sk.com/tvoice/tts"
    headers = {
        "appKey": SK_API_KEY ,
        "Content-Type": "application/json"
    }
    data = {
        "text": text,
        "lang": "ko-KR",
        "voice": "jian",  # 필요한 목소리 유형을 지정
        "speed": "1.0",       # 말하기 속도 조정
        "sr": "16000",        # 샘플링 레이트
        "sformat": "wav"      # 파일 포맷 (wav로 지정)
    }

    # 고유한 파일 이름 생성 (UUID와 타임스탬프를 사용)
    unique_id = uuid.uuid4().hex
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"{unique_id}_{timestamp}.wav"

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        with open(f'static/{filename}', 'wb') as f:
            f.write(response.content)
        return f'static/{filename}'
    else:
        logging.error(f"TTS API 요청 실패: 상태 코드 {response.status_code}, 응답 내용: {response.text}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat')
def chat():
    return render_template('chatBot.html')

@app.route('/situation')
def situation():
    return render_template('situationBot.html')

@app.route('/chat/speech', methods=['POST'])
def chat_speech():
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

        # TTS 생성 및 파일 저장
        audio_file_path = generate_tts(bot_message)
        if audio_file_path:
            return jsonify({"response": bot_message, "audio_url": f"/{audio_file_path}", "stage": stage})
        else:
            return jsonify({"response": "TTS 생성 실패", "audio_url": None, "stage": stage})

    except Exception as e:
        conversation_logger.error(f"오류 발생: {e}")
        return jsonify({"response": "서버에서 문제가 발생했습니다. 다시 시도해주세요."}), 500

@app.route('/situation/speech', methods=['POST'])
def situation_speech():
    try:
        data = request.json
        conversation_history = data.get('conversation_history', [])
        stage = data.get('stage', 'greeting')
        situation = data.get('situation', None)

        if not conversation_history or not conversation_history[-1].get('content'):
            return jsonify({"response": "음성 입력을 인식하지 못했습니다. 다시 시도해주세요.", 
                            "logs": [], 
                            "conversation_history": conversation_history, 
                            "stage": stage})

        # 처음 대화 시작 시 챗봇이 먼저 메시지를 보냄
        if stage == 'greeting':
            if situation:
                if situation == "식당에서 밥을 먹으러 갔을 때":
                    bot_message = "식당에서는 예의 바르게 주문을 해야 해요. '안녕하세요, 저는 ~~를 주문할게요' 라고 말하면 좋아요. 따라해볼까요?"
                elif situation == "학교에서 선생님과 대화할 때":
                    bot_message = "선생님과 대화할 때는 공손하게, '선생님, 질문이 있습니다'처럼 시작해보세요. 따라해볼까요?"
                elif situation == "모르는 사람에게 길을 물어볼 때":
                    bot_message = "모르는 사람에게 길을 물어볼 때는 먼저 '실례합니다, 길 좀 여쭤봐도 될까요?'라고 정중히 물어보세요. 따라해볼까요?"
                elif situation == "사람들이 많은 장소를 이용할 때":
                    bot_message = "사람이 많은 장소에서는 주변 사람들을 배려하며 움직이고, 소곤소곤 대화를 나누는 것이 좋아요. 따라해볼까요? 소곤소곤 대화나누기"
                else:
                    bot_message = "상황을 선택하지 않았습니다. 아무 대화나 시작해보세요!"
                
                stage = 'conversation'  
            else:
                bot_message = "어떤 상황에서 대화를 하고 싶은지 선택해주세요."

            # 메시지를 기록하고 초기 메시지를 반환
            conversation_history.append({"role": "assistant", "content": bot_message})

        elif stage == 'conversation':
            # 상황에 따른 프롬프트 설정
            preprompt = get_preprompt_for_situation(situation)
            conversation_history.insert(0, preprompt)  # 프롬프트를 대화의 첫 부분에 추가
            conversation_logger.info(f"Messages sent to OpenAI: {conversation_history}")
            bot_message = get_openai_response(conversation_history)
            
            if bot_message is None:
                bot_message = "죄송합니다, 응답을 생성하는데 문제가 발생했습니다. 다시 시도해 주세요."
        
        # TTS 생성 및 파일 저장
        audio_file_path = generate_tts(bot_message)
        if audio_file_path:
            return jsonify({"response": bot_message, "audio_url": f"/{audio_file_path}", "stage": stage, "conversation_history": conversation_history})
        else:
            return jsonify({"response": "TTS 생성 실패", "audio_url": None, "stage": stage, "conversation_history": conversation_history})

    except Exception as e:
        conversation_logger.error(f"오류 발생: {e}")
        return jsonify({"response": "서버에서 문제가 발생했습니다. 다시 시도해주세요."}), 500

@app.route('/static/<filename>')
def serve_audio(filename):
    return send_file(f'static/{filename}', mimetype='audio/wav')

if __name__ == '__main__':
    app.run(debug=True, port=5001)

