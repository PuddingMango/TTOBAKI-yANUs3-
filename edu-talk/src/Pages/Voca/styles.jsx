import styled, { keyframes } from 'styled-components';

const SlideInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SlideOutDown = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(20px);
  }
`;

export const StyledSpeechBubble = styled.div`
    max-width: 80%;
    padding: 20px;
    background-color: #8a2be2;
    color: white;
    border-radius: 15px;
    font-size: 24px;
    position: relative;
    text-align: center;
    margin-bottom: 20px;
    animation: ${(props) => (props.isExiting ? SlideOutDown : SlideInUp)} 0.5s ease-in-out;
    animation-fill-mode: forwards;
`;

export const Container = styled.div`
    height: 96vh; /* 화면 전체 높이 */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #f4f4f4;
    padding: 2vh;
    position: relative;
    font-family: 'Roboto', sans-serif;
`;

export const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2vh; 
`;

export const ProgressContainer = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    margin-right: 10px;
`;

export const ProgressIcon = styled.div`
    font-size: 24px;
    color: #4b0082;
`;

export const ProgressBar = styled.div`
    flex: 1;
    height: 10px;
    background-color: #e0e0e0;
    border-radius: 5px;
    margin-left: 10px;
    margin-right: 10px;
    position: relative;
`;

export const Progress = styled.div`
    height: 100%;
    background-color: #8a2be2;
    border-radius: 5px;
    width: ${(props) => props.width || 0}%; /* width가 없을 경우 0%로 시작 */
    transition: width 1s ease-in-out;
`;

export const ProgressText = styled.div`
    font-size: 14px;
    color: #4b0082;
`;

export const SettingsIcon = styled.div`
    font-size: 24px;
    color: #4b0082;
`;

export const MainContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    margin-top: -10vh; /* 단어와 버튼이 화면 중앙에 오도록 조정 */
`;

export const SpeechBubble = styled.div`
    max-width: 80%;
    padding: 20px;
    background-color: #8a2be2;
    color: white;
    border-radius: 15px;
    font-size: 24px;
    position: relative;
    text-align: center;
    margin-bottom: 20px;
    animation: ${(props) => (props.isExiting ? SlideOutDown : SlideInUp)} 0.5s ease-in-out;
    animation-fill-mode: forwards;
`;

export const MicrophoneContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 2vh; /* 간격 추가 */
`;

export const MicrophoneButton = styled.div`
    width: 80px;
    height: 80px;
    background-color: #ffffff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-size: 24px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #f8f9fa;
    }
`;

export const BottomControls = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
`;

export const ControlButton = styled.button`
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #8a2be2;
    background-color: #fff;
    border: 2px solid #8a2be2;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
        background-color: #8a2be2;
        color: #fff;
    }
`;

export const ControlText = styled.div`
    margin-top: 5px;
    font-size: 14px;
`;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export const Modal = styled.div`
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 80%;
    max-width: 500px;
`;

export const ChatContainer = styled.div`
    max-height: 300px;
    overflow-y: auto;
    text-align: left;
`;

export const ChatMessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;

export const UserMessage = styled.div`
    align-self: flex-end;
    background-color: #e9ecef;
    border-radius: 10px;
    padding: 10px;
    max-width: 70%;
    word-wrap: break-word;
`;

export const TranscriptText = styled.p`
    margin-top: 5px;
`;

export const ServerMessage = styled.div`
    align-self: flex-start;
    background-color: #f8d7da;
    border-radius: 10px;
    padding: 10px;
    max-width: 70%;
    word-wrap: break-word;
`;

export const Button = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #8a2be2;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;

    &:hover {
        background-color: #6a1bb1;
    }
`;

export const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    color: #333;

    &:hover {
        color: #555;
    }

    &:focus {
        outline: none;
    }
`;
