import { Col, Container, Row } from "react-bootstrap"
import FormPlay from "../components/FormPlay"
import ListCards from "../components/ListCards"
import ToastWinner from "../components/ToastWinner"

const GamePage = () => {
  return (
    <>
        <Container className="my-4">
            <Row className="justify-content-md-center">
                <Col xs={16} md={16}>
                    <FormPlay />
                </Col>
                <Col xs={16} md={16}>
                    <ListCards />
                </Col>
                <Col>
                    <ToastWinner />
                </Col>
            </Row>
        </Container>
    </>
  )
}

export default GamePage