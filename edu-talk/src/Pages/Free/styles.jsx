import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 96vh;
    padding: 2vh;
    background-color: #f0f0f0;
    font-family: 'Roboto', sans-serif;
`;

export const TopBar = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px 0;
`;

export const SettingsIcon = styled.div`
    font-size: 24px;
    color: #4a90e2;
    cursor: pointer;
`;

export const ChatContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    margin-bottom: 20px;
`;

export const ChatMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${props => (props.align === 'right' ? 'flex-end' : 'flex-start')};
    margin-bottom: 10px;
`;

export const MessageText = styled.p`
    margin: 5px 0;
    background-color: ${props => (props.align === 'right' ? '#daf8e3' : '#f1f0f0')};
    padding: 10px;
    border-radius: 10px;
    max-width: 60%;
`;

export const MicrophoneButton = styled.button`
    background-color: #4a90e2;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 16px;
    cursor: pointer;
    align-self: center;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;

    &:hover {
        background-color: #357ab7;
    }
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
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 80%;
    max-width: 400px;
    position: relative;
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

export const Button = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4a90e2;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #357ab7;
    }
`;
