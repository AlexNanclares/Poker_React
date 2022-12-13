import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { FaGamepad } from 'react-icons/fa'

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <div className='d-inline-block align-top'>
                <FaGamepad />
            </div>{' '}
            Deck Of Cards Game
          </Navbar.Brand>
        </Container>
      </Navbar>
  )
}

export default Header