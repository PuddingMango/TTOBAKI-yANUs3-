import speech_recognition as sr

def recognize_speech(timeout=7, phrase_time_limit=10, adjustment_duration=1):
    recognizer = sr.Recognizer()
    
    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source, duration=adjustment_duration) 
        try:
            audio = recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
            text = recognizer.recognize_google(audio, language="ko-KR")
            return text
        except sr.WaitTimeoutError:
            return None
        except sr.RequestError:
            return None
        except sr.UnknownValueError:
            return None
