import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100vh;
    padding: 20px;
    background-color: #f0f0f0;
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
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 16px;
    cursor: pointer;
    align-self: center;
    margin-top: 10px;
`;
