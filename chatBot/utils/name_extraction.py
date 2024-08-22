import re
from collections import Counter

def extract_name_from_text(text):
    # 불필요한 단어 제거
    text = re.sub(r'(내 이름은|이름은|나는|야|이야)', '', text)
    
    # 단어 리스트 생성
    words = text.split()
    
    # 가장 빈번하게 등장한 단어 찾기
    if words:
        most_common_name = Counter(words).most_common(1)[0][0]
        return most_common_name
    return None
