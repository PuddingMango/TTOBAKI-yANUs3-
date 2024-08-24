import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import CongratulationsModal from '../../components/CongratulationModal';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import * as S from './styles';

const words = [
    '고등어',
    '날씨',
    '토마토',
    '소금',
    '단어장',
];

const Voca = () => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [learningProgress, setLearningProgress] = useState(0); 
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showPronunciationModal, setShowPronunciationModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [recordings, setRecordings] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(0); 
    const navigate = useNavigate();
    const [cookies] = useCookies(['language']);
    const language = cookies.language || 'English';

    const {
        transcript,
        resetTranscript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

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

                    setRecordings(prevRecordings => [
                        ...prevRecordings,
                        {
                            word: words[currentWordIndex],
                            url,
                            transcript: "" 
                        }
                    ]);
                    setAudioChunks([]);
                    handleNextWord();
                };
            })
            .catch(error => {
                setShowPermissionModal(true);
            });
    }, [currentWordIndex]);

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            console.error("This browser does not support STT.");
        }
    }, [browserSupportsSpeechRecognition]);

    useEffect(() => {
        setProgress(((learningProgress) / words.length) * 100);
    }, [learningProgress]);

    const handleMicClick = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            setAudioChunks([]);
            SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
            mediaRecorder.start();
        }
    };

    useEffect(() => {
        if (transcript !== "") {
            setRecordings(prevRecordings => {
                const lastIndex = prevRecordings.length - 1;
                if (lastIndex >= 0) {
                    const updatedRecordings = [...prevRecordings];
                    updatedRecordings[lastIndex] = {
                        ...updatedRecordings[lastIndex],
                        transcript: transcript
                    };
                    return updatedRecordings;
                }
                return prevRecordings;
            });
        }
    }, [transcript]);

    const speakWord = (word) => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'ko-KR';
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        speakWord(words[currentWordIndex]);
    }, [currentWordIndex]);

    const handleNextWord = () => {
        if (currentWordIndex < words.length - 1) {
            setIsExiting(true);
            setTimeout(() => {
                setCurrentWordIndex(currentWordIndex + 1);
                setLearningProgress(learningProgress + 1);
                setIsExiting(false);
            }, 500);
        } else {
            setProgress(100);
            setLearningProgress(5);
            setTimeout(() => {
                triggerCompletion();
            }, 500);
        }
    };

    const triggerCompletion = () => {
        setShowConfetti(true);
        setTimeout(() => {
            setShowCompletionModal(true);
        }, 2000);
    };

    const handleGoMainModal = () => {
        setShowCompletionModal(false);
        setCurrentWordIndex(0);
        setLearningProgress(0);
        setProgress(0);
        setShowConfetti(false);
        navigate('/');
    };

    const handlePronunciationClick = () => {
        setShowPronunciationModal(true);
    };

    const handleCloseModal = () => {
        setShowPronunciationModal(false);
    };

    const handleRefreshPage = () => {
        window.location.reload();
    };

    const handleSettingsClick = () => {
        setShowSettingsModal(true);
    };

    const handleCloseSettingsModal = () => {
        setShowSettingsModal(false);
    };

    const texts = {
        English: {
            settings: 'Settings',
            exit: 'Exit',
            listenAgain: 'Listen Again',
            conversationHistory: 'Conversation History',
            microphonePermission: 'Please enable microphone permission',
            close: 'Close'
        },
        Korean: {
            settings: '설정',
            exit: '나가기',
            listenAgain: '다시 듣기',
            conversationHistory: '대화 내역',
            microphonePermission: '마이크 사용 권한을 켜주세요',
            close: '닫기'
        },
        Japanese: {
            settings: '設定',
            exit: '退出',
            listenAgain: 'もう一度聞く',
            conversationHistory: '会話履歴',
            microphonePermission: 'マイクの使用許可を有効にしてください',
            close: '閉じる'
        }
    };

    return (
        <S.Container>
            <S.TopBar>
                <S.ProgressContainer>
                    <S.ProgressIcon>🎧</S.ProgressIcon>
                    <S.ProgressBar>
                        <S.Progress width={progress} />
                    </S.ProgressBar>
                    <S.ProgressText>{learningProgress}/{words.length}</S.ProgressText>
                </S.ProgressContainer>
                <S.SettingsIcon onClick={handleSettingsClick}>⚙️</S.SettingsIcon>
            </S.TopBar>

            <S.MainContent>
                <S.SpeechBubble isexiting={isExiting ? true : undefined}>
                {words[currentWordIndex]}
                </S.SpeechBubble>
                <S.ControlButton onClick={() => speakWord(words[currentWordIndex])}>
                    {texts[language].listenAgain} 🔊
                </S.ControlButton>
            </S.MainContent>

            <S.MicrophoneContainer>
                <S.MicrophoneButton onClick={handleMicClick}>
                    {listening ? '🛑' : '🎤'}
                </S.MicrophoneButton>
            </S.MicrophoneContainer>

            <S.BottomControls>
                <S.ControlButton onClick={handlePronunciationClick}>
                    <span role="img" aria-label="play">🔊</span>
                    <S.ControlText>{texts[language].conversationHistory}</S.ControlText>
                </S.ControlButton>
            </S.BottomControls>

            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={500}
                    style={{ position: 'fixed', top: 0, left: 0, zIndex: 1100 }}
                />
            )}

            {showPronunciationModal && (
                <S.ModalOverlay>
                    <S.Modal>
                        <h3>{texts[language].conversationHistory}</h3>
                        <S.ChatContainer>
                            {recordings.map((recording, index) => (
                                <S.ChatMessageContainer key={index}>
                                    <S.UserMessage>
                                        <audio controls>
                                            <source src={recording.url} type="audio/wav" />
                                            Your browser does not support the audio element.
                                        </audio>
                                        <S.TranscriptText>{recording.transcript}</S.TranscriptText>
                                    </S.UserMessage>
                                    <S.ServerMessage>
                                        <p>피드백 영역 (여기에 서버 응답이 표시됩니다)</p>
                                    </S.ServerMessage>
                                </S.ChatMessageContainer>
                            ))}
                        </S.ChatContainer>
                        <S.Button onClick={handleCloseModal}>{texts[language].close}</S.Button>
                    </S.Modal>
                </S.ModalOverlay>
            )}

            {showCompletionModal && <CongratulationsModal goMain={handleGoMainModal} />}

            {showSettingsModal && (
                <S.ModalOverlay>
                    <S.Modal>
                        <S.CloseButton onClick={handleCloseSettingsModal}>×</S.CloseButton>
                        <h3>{texts[language].settings}</h3>
                        <S.Button onClick={() => navigate('/')}>{texts[language].exit}</S.Button>
                    </S.Modal>
                </S.ModalOverlay>
            )}

            {showPermissionModal && (
                <S.ModalOverlay>
                    <S.Modal>
                        <h3>{texts[language].microphonePermission}</h3>
                        <S.Button onClick={handleRefreshPage}>{texts[language].close}</S.Button>
                    </S.Modal>
                </S.ModalOverlay>
            )}
        </S.Container>
    );
};

export default Voca;
