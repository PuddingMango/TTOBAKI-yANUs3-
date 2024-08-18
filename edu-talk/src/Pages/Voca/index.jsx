import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import CongratulationsModal from '../../components/CongratulationModal';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import * as S from './styles';  // 스타일 파일 import

const words = [
    '고등어',
    '날씨',
    '토마토',
    '소금',
    '단어장',
];

const Voca = () => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showPronunciationModal, setShowPronunciationModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [recordings, setRecordings] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const navigate = useNavigate();
    const {
        transcript,
        resetTranscript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                console.log("Microphone access granted");
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                recorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                    console.log("Data available: ", event.data);
                };

                recorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const url = URL.createObjectURL(audioBlob);
                    console.log("Final Blob size: ", audioBlob.size);
                    console.log("Audio URL: ", url);

                    setRecordings(prevRecordings => [
                        ...prevRecordings,
                        {
                            word: words[currentWordIndex],
                            url,
                            transcript: "" // 초기 상태에서는 빈 문자열로 설정
                        }
                    ]);
                    setAudioChunks([]); // 청크 초기화
                    handleNextWord();
                };
            })
            .catch(error => {
                console.error("Microphone permission error: ", error);
                setShowPermissionModal(true);
            });
    }, [currentWordIndex]);

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            console.error("This browser does not support STT.");
        } else {
            console.log("Browser supports STT.");
        }
    }, [browserSupportsSpeechRecognition]);

    const handleMicClick = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            console.log("Stopping recording...");
            mediaRecorder.stop();
            SpeechRecognition.stopListening();
        } else {
            console.log("Starting recording...");
            resetTranscript();
            setAudioChunks([]);
            SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
            mediaRecorder.start();
        }
    };

    useEffect(() => {
        console.log("Transcript updated: ", transcript);
        if (transcript !== "") {
            setRecordings(prevRecordings => {
                const lastIndex = prevRecordings.length - 1;
                if (lastIndex >= 0) {
                    const updatedRecordings = [...prevRecordings];
                    updatedRecordings[lastIndex] = {
                        ...updatedRecordings[lastIndex],
                        transcript: transcript
                    };
                    console.log("Updated recordings:", updatedRecordings);
                    return updatedRecordings;
                }
                return prevRecordings;
            });
        } else {
            console.error("STT 변환이 실패했습니다.");
        }
    }, [transcript]);

    // TTS를 실행하는 함수
    const speakWord = (word) => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'ko-KR'; // 한국어로 설정
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        // 현재 단어를 읽음
        speakWord(words[currentWordIndex]);
    }, [currentWordIndex]);

    const handleNextWord = () => {
        console.log("Next word index: ", currentWordIndex + 1);
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
        } else {
            triggerCompletion();
        }
    };

    const triggerCompletion = () => {
        console.log("Completion triggered");
        setShowConfetti(true);
        setTimeout(() => {
            setShowCompletionModal(true);
        }, 2000);
    };

    const handleGoMainModal = () => {
        console.log("Returning to main page");
        setShowCompletionModal(false);
        setCurrentWordIndex(0);
        setShowConfetti(false);
        navigate('/');
    };

    const handlePronunciationClick = () => {
        console.log("Opening pronunciation modal");
        setShowPronunciationModal(true);
    };

    const handleCloseModal = () => {
        console.log("Closing modal");
        setShowPronunciationModal(false);
    };

    const handleRefreshPage = () => {
        console.log("Refreshing page");
        window.location.reload();
    };

    const progress = (currentWordIndex / (words.length - 1)) * 100;

    return (
        <S.Container>
            <S.TopBar>
                <S.ProgressContainer>
                    <S.ProgressIcon>🎧</S.ProgressIcon>
                    <S.ProgressBar>
                        <S.Progress width={progress} />
                    </S.ProgressBar>
                    <S.ProgressText>{currentWordIndex + 1}/{words.length}</S.ProgressText>
                </S.ProgressContainer>
                <S.SettingsIcon>⚙️</S.SettingsIcon>
            </S.TopBar>

            <S.MainContent>
                <S.SpeechBubble>
                    {words[currentWordIndex]}
                </S.SpeechBubble>
                {/* TTS 재생 버튼 */}
                <S.ControlButton onClick={() => speakWord(words[currentWordIndex])}>
                    다시 듣기 🔊
                </S.ControlButton>
            </S.MainContent>

            <S.MicrophoneContainer>
                <S.MicrophoneButton onClick={handleMicClick}>
                    {listening ? '녹음 중...' : '🎤'}
                </S.MicrophoneButton>
            </S.MicrophoneContainer>

            <S.BottomControls>
                <S.ControlButton onClick={handlePronunciationClick}>
                    <span role="img" aria-label="play">🔊</span>
                    <S.ControlText>대화 내역</S.ControlText>
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
                        <h3>대화 내역</h3>
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
                        <S.Button onClick={handleCloseModal}>닫기</S.Button>
                    </S.Modal>
                </S.ModalOverlay>
            )}

            {showCompletionModal && <CongratulationsModal goMain={handleGoMainModal} />}

            {showPermissionModal && (
                <S.ModalOverlay>
                    <S.Modal>
                        <h3>마이크 사용 권한을 켜주세요</h3>
                        <S.Button onClick={handleRefreshPage}>새로고침</S.Button>
                    </S.Modal>
                </S.ModalOverlay>
            )}
        </S.Container>
    );
};

export default Voca;
