import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import useGame from '../hooks/useGame';
import { FaGamepad } from 'react-icons/fa'

const ToastWinner = () => {

    const { showToast, setShowToast, winName } = useGame();

    const toggleShowA = () => setShowA(!showA);
    
    return (
        
        <ToastContainer className="p-3" position="top-start">
            <Toast show={showToast} onClose={() => setShowToast(false)}>
                <Toast.Header>
                <div>
                    <FaGamepad />
                </div>
                <strong className="me-auto">Deck Of Cards</strong>
                <small>Winner</small>
                </Toast.Header>
                <Toast.Body>Player {winName}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default ToastWinner