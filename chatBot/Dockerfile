# Python 3.9.7 버전의 공식 Python 이미지를 베이스로 사용
FROM python:3.9.7

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# portaudio 설치
RUN apt-get update && apt-get install -y portaudio19-dev

# 애플리케이션의 종속성 설치를 위한 requirements.txt 파일을 복사
COPY requirements.txt .

# pip 버전 출력 및 개별 패키지 설치 시도
RUN pip --version \
    && pip install --no-cache-dir -r requirements.txt

# 애플리케이션 소스 코드를 이미지에 복사
COPY . .

# FastAPI 애플리케이션 실행을 위해 CMD 명령어 추가
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app"]

