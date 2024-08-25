    import React, { useState, useEffect } from 'react';
    import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
    import { useCookies } from 'react-cookie';
    import { useNavigate } from 'react-router-dom';
    import * as S from './styles';

    const Free = () => {
        const [messages, setMessages] = useState([]);
        const [listening, setListening] = useState(false);
        const [showSettingsModal, setShowSettingsModal] = useState(false);
        const [initialMessageVisible, setInitialMessageVisible] = useState(true);
        const [conversationStage, setConversationStage] = useState('greeting'); // 현재 대화 단계
        const navigate = useNavigate();

        const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({
            continuous: false, // 음성 인식이 완료되면 자동으로 멈추도록 설정
            interimResults: false,
        });

        const [cookies] = useCookies(['language']);
        const language = cookies.language || 'English';

        useEffect(() => {
            if (!browserSupportsSpeechRecognition) {
                console.error("This browser does not support speech recognition.");
            }
        }, [browserSupportsSpeechRecognition]);

        useEffect(() => {
            if (transcript && initialMessageVisible) {
                setInitialMessageVisible(false);
            }

            if (transcript && !listening) {
                sendSpeechToServer(transcript, conversationStage);
                resetTranscript(); // 현재 transcript를 서버로 보내고 리셋
            }
        }, [transcript, listening]);

        const handleMicClick = () => {
            if (listening) {
                SpeechRecognition.stopListening();
                setListening(false);
            } else {
                resetTranscript();
                SpeechRecognition.startListening({ language: 'ko-KR' });
                setListening(true);
            }
        };

        const sendSpeechToServer = async (speechText, stage) => {
            const response = await fetch('http://127.0.0.1:5001/speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({ text: speechText, stage: stage }),
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
            setConversationStage(data.stage); // 서버에서 새로운 단계 정보를 받아와서 업데이트
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
                startRecording: '🎤 Start Talking',
                stopRecording: '🛑 Stop Talking',
                exit: 'Exit',
                close: 'Close',
                initialMessage: 'Say "Hello" to start!',
            },
            Korean: {
                settings: '설정',
                startRecording: '🎤 말하기 시작',
                stopRecording: '🛑 말하기 중지',
                exit: '나가기',
                close: '닫기',
                initialMessage: '안녕이라 하고 시작해보세요!',
            },
            Japanese: {
                settings: '設定',
                startRecording: '🎤 話し始める',
                stopRecording: '🛑 話すのをやめる',
                exit: '退出',
                close: '閉じる',
                initialMessage: 'こんにちはと言って始めてください!',
            }
        };

        return (
            <S.Container>
                <S.TopBar>
                    <S.SettingsIcon onClick={handleSettingsClick}>⚙️</S.SettingsIcon>
                </S.TopBar>

                <S.ChatContainer>
                    {initialMessageVisible && (
                        <S.InitialMessage>{texts[language].initialMessage}</S.InitialMessage>
                    )}
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
