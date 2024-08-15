from flask import Flask, render_template, request, jsonify
import speech_recognition as sr
import openai

app = Flask(__name__)

# OpenAI API 키 설정
openai.api_key = 'your-openai-api-key' 

# 음성 인식 함수
def recognize_speech():
    recognizer = sr.Recognizer()
    
    with sr.Microphone() as source:
        print("말하세요!")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
        print("음성 입력 완료.")
        
        try:
            text = recognizer.recognize_google(audio, language="ko-KR")
            print("인식된 텍스트:", text)
            return text
        except sr.RequestError:
            print("API에 요청할 수 없습니다.")
            return None
        except sr.UnknownValueError:
            print("음성을 인식할 수 없습니다.")
            return None

# OpenAI 응답 생성 함수
def get_openai_response(prompt, context=None):
    messages = [
        {
            "role": "system",
            "content": "You are a friendly companion who talks to a child who is not fluent in Korean."
        }
    ]
    
    if context:
        messages.append({"role": "assistant", "content": f"User's name is {context['name']} and age is {context['age']}."})
    
    messages.append({"role": "user", "content": prompt})
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  # 사용할 모델명
            messages=messages
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        print(f"OpenAI API 호출 중 오류 발생: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/speech', methods=['POST'])
def speech():
    user_info = {"name": None, "age": None}
    
    name_response = recognize_speech()
    if name_response:
        user_info["name"] = name_response.strip()

        age_question = f"{user_info['name']}는 몇 살이야?"
        print("챗봇:", age_question)

        age_response = recognize_speech()
        if age_response:
            user_info["age"] = age_response.strip()

            follow_up_question = f"반가워, {user_info['name']}! {user_info['age']}살이라니! 이제 뭐하고 놀까?"
            response = get_openai_response(follow_up_question, context=user_info)

            return jsonify({"response": response})
    
    return jsonify({"response": "문제가 발생했습니다."})

if __name__ == '__main__':
    app.run(debug=True)

