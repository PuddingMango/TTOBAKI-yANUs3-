import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 96vh;
  justify-content: space-between;
  padding: 2vh;
  background-color: #f0f0f0;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const SettingsIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
`;

export const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
`;

export const ChatMessage = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  justify-content: ${(props) => (props.align === 'right' ? 'flex-end' : 'flex-start')};
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => (props.align === 'right' ? '#4A90E2' : '#F5A623')};
  margin-right: ${(props) => (props.align === 'right' ? '0' : '10px')};
  margin-left: ${(props) => (props.align === 'right' ? '10px' : '0')};
`;

export const MessageContent = styled.div`
  max-width: 60%;
  background-color: ${(props) => (props.align === 'right' ? '#E1F5FE' : '#FFF59D')};
  padding: 10px;
  border-radius: 10px;
`;

export const MessageText = styled.div`
  font-size: 16px;
`;

export const TimeStamp = styled.div`
  font-size: 12px;
  color: #999;
  text-align: ${(props) => (props.align === 'right' ? 'right' : 'left')};
  margin-top: 5px;
`;

export const MicrophoneButton = styled.button`
  padding: 15px 30px;
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #357ABD;
  }
`;

export const StartButton = styled(MicrophoneButton)`
  background-color: #7FB800;
  &:hover {
    background-color: #6EA700;
  }
`;

export const InitialMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
  color: #555;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

export const Button = styled.button`
  background-color: #4A90E2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 16px;
  &:hover {
    background-color: #357ABD;
  }
`;
