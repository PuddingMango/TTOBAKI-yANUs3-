from flask import Flask, render_template, request, jsonify
from utils.speech_recognition import recognize_speech
from utils.openai_interaction import get_openai_response
from utils.convert_korean_age import convert_korean_age_to_number
from utils.name_extraction import extract_name_from_text
from config import OPENAI_API_KEY

app = Flask(__name__)

# OpenAI API 키 설정
import openai
openai.api_key = OPENAI_API_KEY

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/speech', methods=['POST'])
def speech():
    user_info = {"name": None, "age": None, "friend_type": None}
    conversation_history = [
        {"role": "system", "content": "You are a friendly companion who talks to a child who is not fluent in Korean."}
    ]
    
    # 사용자 첫 인사 인식
    user_greeting = recognize_speech()
    if user_greeting and ("안녕" in user_greeting):
        initial_response = "안녕? 너는 누구야?"
        print("챗봇:", initial_response)

        # 사용자 이름 인식
        name_response = recognize_speech()
        if name_response:
            user_info["name"] = extract_name_from_text(name_response.strip())
            print(f"인식된 이름: {user_info['name']}")

            # 챗봇이 사용자 나이를 물음
            age_question = f"{user_info['name']}는 몇 살이야?"
            print("챗봇:", age_question)

            # 사용자 나이 인식
            age_response = recognize_speech()
            if age_response:
                user_info["age"] = convert_korean_age_to_number(age_response.strip()) or age_response.strip()

                # 챗봇이 어떤 친구가 되고 싶은지 질문
                friend_question = f"나는 어떤 친구가 될까?"
                print("챗봇:", friend_question)

                # 사용자 친구 타입 인식
                friend_response = recognize_speech()
                if friend_response:
                    user_info["friend_type"] = friend_response.strip()

                    # 챗봇이 사용자 정보 기반으로 후속 메시지
                    follow_up_message = f"알겠어! 나는 {user_info['name']}의 {user_info['age']}살에 맞는 {user_info['friend_type']}가 될게!"
                    conversation_history.append({"role": "assistant", "content": follow_up_message})

                    # 응답 전송
                    print("챗봇:", follow_up_message)

                    # 사용자가 자유롭게 대화를 이어가도록 처리
                    while True:
                        user_input = recognize_speech()
                        if user_input:
                            conversation_history.append({"role": "user", "content": user_input})
                            bot_response = get_openai_response(conversation_history)
                            if bot_response:
                                print("챗봇:", bot_response)
                                conversation_history.append({"role": "assistant", "content": bot_response})
                            else:
                                print("챗봇: 대화 중 문제가 발생했어요.")
                                break
                        else:
                            print("챗봇: 음성을 인식할 수 없었어요. 다시 시도해 주세요.")
                            break
    
    return jsonify({"response": "문제가 발생했습니다."})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
