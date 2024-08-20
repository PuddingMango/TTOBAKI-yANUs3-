import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import * as S from './styles';  // 스타일 파일 import

const Free = () => {
    const [messages, setMessages] = useState([]);
    const [audioChunks, setAudioChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [listening, setListening] = useState(false);

    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        // MediaRecorder 초기 설정
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                recorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                recorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const url = URL.createObjectURL(audioBlob);
                    const userMessage = {
                        type: 'user',
                        url,
                        transcript
                    };

                    setMessages(prevMessages => [...prevMessages, userMessage]);
                    setAudioChunks([]);
                    resetTranscript();

                    // 서버로 데이터 전송 후 응답 받기
                    fetchServerResponse(audioBlob);
                };
            })
            .catch(error => console.error("Microphone permission error: ", error));
    }, []);

    const fetchServerResponse = async (audioBlob) => {
        // 서버로 음성 데이터 전송
        const formData = new FormData();
        formData.append('file', audioBlob, 'user_audio.wav');

        const response = await fetch('https://your-server-endpoint.com/voice', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        const serverMessage = {
            type: 'server',
            url: data.audioUrl,  // 서버에서 응답받은 음성 파일 URL
            transcript: data.transcript  // 서버에서 응답받은 텍스트
        };

        setMessages(prevMessages => [...prevMessages, serverMessage]);
        playAudio(data.audioUrl);
    };

    const playAudio = (url) => {
        const audio = new Audio(url);
        audio.play();
    };

    const handleMicClick = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            SpeechRecognition.stopListening();
            setListening(false);
        } else {
            resetTranscript();
            setAudioChunks([]);
            SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
            mediaRecorder.start();
            setListening(true);
        }
    };

    return (
        <S.Container>
            <S.ChatContainer>
                {messages.map((message, index) => (
                    <S.ChatMessage key={index} align={message.type === 'user' ? 'right' : 'left'}>
                        <audio controls src={message.url} />
                        <S.MessageText>{message.transcript}</S.MessageText>
                    </S.ChatMessage>
                ))}
            </S.ChatContainer>

            <S.MicrophoneButton onClick={handleMicClick}>
                {listening ? '녹음 중...' : '🎤'}
            </S.MicrophoneButton>
        </S.Container>
    );
};

export default Free;
