import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useCookies } from 'react-cookie'; 
import { useNavigate } from 'react-router-dom';
import * as S from './styles';  

const Free = () => {
    const [messages, setMessages] = useState([]);
    const [listening, setListening] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);  
    const navigate = useNavigate();

    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [cookies] = useCookies(['language']);  
    const language = cookies.language || 'English';  

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            console.error("This browser does not support speech recognition.");
        }
    }, [browserSupportsSpeechRecognition]);

    const handleMicClick = () => {
        if (listening) {
            SpeechRecognition.stopListening();
            setListening(false);
            sendSpeechToServer(transcript); // 음성을 서버로 전송
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
            setListening(true);
        }
    };

    const sendSpeechToServer = async (speechText) => {
        const response = await fetch('http://127.0.0.1:5000/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',  
            body: JSON.stringify({ text: speechText }),
        });
        const data = await response.json();
        const userMessage = {
            type: 'user',
            transcript: speechText,
            timestamp: new Date().toLocaleTimeString(),
        };
        const botMessage = {
            type: 'bot',
            transcript: data.response,
            timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prevMessages => [...prevMessages, userMessage, botMessage]);
    };

    const handleSettingsClick = () => {
        setShowSettingsModal(true);
    };

    const handleCloseSettingsModal = () => {
        setShowSettingsModal(false);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const texts = {
        English: {
            settings: 'Settings',
            startRecording: '🎤',
            stopRecording: '🛑',
            exit: 'Exit',
            close: 'Close',
        },
        Korean: {
            settings: '설정',
            startRecording: '🎤',
            stopRecording: '🛑',
            exit: '나가기',
            close: '닫기',
        },
        Japanese: {
            settings: '設定',
            startRecording: '🎤',
            stopRecording: '🛑',
            exit: '退出',
            close: '閉じる',
        }
    };

    return (
        <S.Container>
            <S.TopBar>
                <S.SettingsIcon onClick={handleSettingsClick}>⚙️</S.SettingsIcon>
            </S.TopBar>

            <S.ChatContainer>
                {messages.map((message, index) => (
                    <S.ChatMessage key={index} align={message.type === 'user' ? 'right' : 'left'}>
                        <S.Avatar align={message.type === 'user' ? 'right' : 'left'} />
                        <S.MessageContent align={message.type === 'user' ? 'right' : 'left'}>
                            <S.MessageText align={message.type === 'user' ? 'right' : 'left'}>
                                {message.transcript}
                            </S.MessageText>
                            <S.TimeStamp>{message.timestamp}</S.TimeStamp>
                        </S.MessageContent>
                    </S.ChatMessage>
                ))}
            </S.ChatContainer>

            <S.MicrophoneButton onClick={handleMicClick}>
                {listening ? texts[language].stopRecording : texts[language].startRecording}
            </S.MicrophoneButton>

            {showSettingsModal && (
                <S.ModalOverlay>
                    <S.Modal>
                        <S.CloseButton onClick={handleCloseSettingsModal}>×</S.CloseButton>
                        <h3>{texts[language].settings}</h3>
                        <S.Button onClick={handleGoHome}>{texts[language].exit}</S.Button>
                    </S.Modal>
                </S.ModalOverlay>
            )}
        </S.Container>
    );
};

export default Free;
