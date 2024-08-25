# convert_korean_age.py

korean_to_num = {
    "하나": 1, "둘": 2, "셋": 3, "넷": 4, "다섯": 5,
    "여섯": 6, "일곱": 7, "여덟": 8, "아홉": 9, "열": 10,
    "스물": 20, "서른": 30, "마흔": 40, "쉰": 50, "예순": 60,
    "한": 1, "두": 2, "세": 3, "네": 4, "다섯": 5,
    "여섯": 6, "일곱": 7, "여덟": 8, "아홉": 9, "열": 10
}

def convert_korean_age_to_number(korean_age):
    words = korean_age.split()
    total = 0
    
    for word in words:
        if word.isdigit(): 
            total += int(word)
        elif word in korean_to_num:
            total += korean_to_num[word]
        elif word == "살":
            continue 
    
    return total if total > 0 else None 
