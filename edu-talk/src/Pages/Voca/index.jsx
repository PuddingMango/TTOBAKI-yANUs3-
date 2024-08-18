import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import CongratulationsModal from '../../components/CongratulationModal';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

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
    const [recordings, setRecordings] = useState([]); // 녹음된 내역 저장
    const [mediaRecorder, setMediaRecorder] = useState(null); // MediaRecorder 객체 저장
    const [audioChunks, setAudioChunks] = useState([]); // 오디오 청크를 저장할 배열
    const navigate = useNavigate();

    const {
        transcript,
        resetTranscript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        // MediaRecorder 초기 설정
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
                    console.log("Final Blob size: ", audioBlob.size);  // Blob 크기 확인
                    const url = URL.createObjectURL(audioBlob);
                    console.log("Audio URL: ", url);
                    setRecordings(prev => [
                        ...prev,
                        {
                            word: words[currentWordIndex],
                            url,
                            transcript // STT 변환된 텍스트 저장
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
            mediaRecorder.stop();  // 녹음을 중지하고 데이터를 수집합니다.
            SpeechRecognition.stopListening(); // STT 중지
        } else {
            console.log("Starting recording...");
            resetTranscript();
            setAudioChunks([]); // 녹음 시작 전에 청크를 초기화
            SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' }); // STT 시작
            mediaRecorder.start();  // 녹음을 시작합니다.
        }
    };

    useEffect(() => {
        console.log("Transcript updated: ", transcript);
        if (transcript !== "") {
            setRecordings(prev => prev.map((recording, index) => 
                index === currentWordIndex ? { ...recording, transcript } : recording
            ));
        } else {
            console.error("STT 변환이 실패했습니다.");
        }
    }, [transcript]);
    

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
        }, 2000); // Show modal after confetti
    };

    const handleGoMainModal = () => {
        console.log("Returning to main page");
        setShowCompletionModal(false);
        setCurrentWordIndex(0);
        setShowConfetti(false);
        navigate('/'); // Use navigate to go to the main page
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
        window.location.reload(); // 페이지 새로고침
    };

    const progress = (currentWordIndex / (words.length - 1)) * 100;

    return (
        <div style={styles.container}>
            {/* Top Progress Bar */}
            <div style={styles.topBar}>
                <div style={styles.progressContainer}>
                    <div style={styles.progressIcon}>🎧</div>
                    <div style={styles.progressBar}>
                        <div style={{ ...styles.progress, width: `${progress}%` }}></div>
                    </div>
                    <div style={styles.progressText}>{currentWordIndex + 1}/{words.length}</div>
                </div>
                <div style={styles.settingsIcon}>⚙️</div>
            </div>

            {/* Main Content Area */}
            <div style={styles.mainContent}>
                <div style={styles.speechBubble}>
                    {words[currentWordIndex]}
                </div>
            </div>

            {/* Microphone Button */}
            <div style={styles.microphoneContainer}>
                <div style={styles.microphoneButton} onClick={handleMicClick}>
                    {listening ? '녹음 중...' : '🎤'}
                </div>
            </div>

            {/* Bottom Controls */}
            <div style={styles.bottomControls}>
                <div style={styles.controlButton} onClick={handlePronunciationClick}>
                    <span role="img" aria-label="play">🔊</span>
                    <div style={styles.controlText}>대화 내역</div>
                </div>
            </div>

            {/* Confetti Effect */}
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={500}
                    style={{ position: 'fixed', top: 0, left: 0, zIndex: 1100 }}
                />
            )}

            {/* Modal for Pronunciation */}
            {showPronunciationModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>대화 내역</h3>
                        <div style={styles.chatContainer}>
                            {recordings.map((recording, index) => (
                                <div key={index} style={styles.chatMessageContainer}>
                                    <div style={styles.userMessage}>
                                        <audio controls>
                                            <source src={recording.url} type="audio/wav" />
                                            Your browser does not support the audio element.
                                        </audio>
                                        <p style={styles.transcriptText}>{recording.transcript}</p> {/* 녹음된 텍스트를 오디오 아래에 표시 */}
                                    </div>
                                    <div style={styles.serverMessage}>
                                        <p>피드백 영역 (여기에 서버 응답이 표시됩니다)</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button style={styles.button} onClick={handleCloseModal}>닫기</button>
                    </div>
                </div>
            )}

            {/* Modal for Completion */}
            {showCompletionModal && <CongratulationsModal goMain={handleGoMainModal} />}

            {/* Modal for Microphone Permission */}
            {showPermissionModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>마이크 사용 권한을 켜주세요</h3>
                        <button style={styles.button} onClick={handleRefreshPage}>새로고침</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#E6F7FF',
        padding: '20px',
        position: 'relative',
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressContainer: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        marginRight: '10px',
    },
    progressIcon: {
        fontSize: '24px',
    },
    progressBar: {
        flex: 1,
        height: '10px',
        backgroundColor: '#D9D9D9',
        borderRadius: '5px',
        marginLeft: '10px',
        marginRight: '10px',
        position: 'relative',
    },
    progress: {
        height: '100%',
        backgroundColor: '#FFAA00',
        borderRadius: '5px',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    progressText: {
        fontSize: '14px',
    },
    settingsIcon: {
        fontSize: '24px',
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    speechBubble: {
        maxWidth: '80%',
        padding: '20px',
        backgroundColor: '#8A2BE2',
        color: 'white',
        borderRadius: '15px',
        fontSize: '18px',
        position: 'relative',
        textAlign: 'center',
    },
    microphoneContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
    },
    microphoneButton: {
        width: '80px',
        height: '80px',
        backgroundColor: 'white',
        borderRadius: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        fontSize: '18px',
        cursor: 'pointer',
    },
    bottomControls: {
        display: 'flex',
        justifyContent: 'space-around',
        paddingBottom: '20px',
    },
    controlButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '20px',
        color: '#666',
        cursor: 'pointer',
    },
    controlText: {
        marginTop: '5px',
        fontSize: '14px',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '80%',
        maxWidth: '500px',
    },
    chatContainer: {
        maxHeight: '300px',
        overflowY: 'auto',
        textAlign: 'left',
    },
    chatMessageContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '10px',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#D1E7DD',
        borderRadius: '10px',
        padding: '10px',
        maxWidth: '70%',
        wordWrap: 'break-word',
    },
    transcriptText: {
        marginTop: '5px',  // STT 텍스트와 오디오 플레이어 사이에 공간을 둠
    },
    serverMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#F8D7DA',
        borderRadius: '10px',
        padding: '10px',
        maxWidth: '70%',
        wordWrap: 'break-word',
    },
    button: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#4A90E2',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default Voca;
