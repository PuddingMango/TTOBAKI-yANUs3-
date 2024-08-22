import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useCookies } from 'react-cookie';  // 쿠키 훅 import
import { useNavigate } from 'react-router-dom';
import * as S from './styles';  // 스타일 파일 import

const Free = () => {
    const [messages, setMessages] = useState([]);
    const [audioChunks, setAudioChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [listening, setListening] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);  // 설정 모달 상태 추가
    const navigate = useNavigate();

    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [cookies] = useCookies(['language']);  // 쿠키에서 언어 정보 가져오기
    const language = cookies.language || 'English';  // 쿠키에서 언어 설정값 가져오기

    useEffect(() => {
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
                    // fetchServerResponse(audioBlob);
                };
            })
            .catch(error => console.error("Microphone permission error: ", error));
    }, []);

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

    const handleSettingsClick = () => {
        setShowSettingsModal(true);
    };

    const handleCloseSettingsModal = () => {
        setShowSettingsModal(false);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    // 언어별 텍스트
    const texts = {
        English: {
            settings: 'Settings',
            microphonePermission: 'Please enable microphone permission',
            startRecording: 'Start Recording',
            stopRecording: 'Stop Recording',
            exit: 'Exit',
            close: 'Close',
        },
        Korean: {
            settings: '설정',
            microphonePermission: '마이크 사용 권한을 켜주세요',
            startRecording: '녹음 시작',
            stopRecording: '녹음 중지',
            exit: '나가기',
            close: '닫기',
        },
        Japanese: {
            settings: '設定',
            microphonePermission: 'マイクの使用許可を有効にしてください',
            startRecording: '録音開始',
            stopRecording: '録音停止',
            exit: '退出',
            close: '閉じる',
        }
    };

    return (
        <S.Container>
            {/* 상단 바 */}
            <S.TopBar>
                <S.SettingsIcon onClick={handleSettingsClick}>⚙️</S.SettingsIcon>
            </S.TopBar>

            <S.ChatContainer>
                {messages.map((message, index) => (
                    <S.ChatMessage key={index} align={message.type === 'user' ? 'right' : 'left'}>
                        <audio controls src={message.url} />
                        <S.MessageText align={message.type === 'user' ? 'right' : 'left'}>
                            {message.transcript}
                        </S.MessageText>
                    </S.ChatMessage>
                ))}
            </S.ChatContainer>

            <S.MicrophoneButton onClick={handleMicClick}>
                {listening ? texts[language].stopRecording : texts[language].startRecording}
            </S.MicrophoneButton>

            {/* 설정 모달 */}
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
