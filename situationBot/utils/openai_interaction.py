import openai

def get_openai_response(messages):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",  # 사용할 모델명
            messages=messages
        )
        return response.choices[0].message["content"]
    except Exception as e:
        print(f"OpenAI API 호출 중 오류 발생: {e}")
        return None
