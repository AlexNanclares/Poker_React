import { useState } from 'react';
import DeckOfCardsAPI from '../services/deckofcardsapi';
import GameContext from './GameContext';

const GameProvider = ({ children }) => {
  
    const [win, setWin] = useState(false);
    const [showToast, setShowToast] = useState(false)
    const [winName, setWinName] = useState("")
    const [idGame, setIdGame] = useState(null);
    const [playerOne, setPlayerOne] = useState({
        name: "",
        cards: [],
        ternas: 0,
        cuartas: 0,
        escaleras: 0
    });

    const [playerTwo, setPlayerTwo] = useState({
        name: "",
        cards: [],
        ternas: 0,
        cuartas: 0,
        escaleras: 0
    });

    const identifyWin = () =>{
        if(playerOne.ternas == 2 && (playerOne.cuartas == 1 || playerOne.escaleras == 1)){
            setWin(true);
            setShowToast(true);
            setWinName(playerOne.name);
        } else if(playerTwo.ternas == 2 && (playerTwo.cuartas == 1 || playerTwo.escaleras == 1)){
            setWin(true);
            setShowToast(true);
            setWinName(playerTwo.name);
        }
    }

    const identifyRepeated = (duplicates) =>{

        for (let i = 0; i < duplicates.length; i++){
            if(duplicates[i + 1]?.suit === duplicates[i].suit){
                return true;
            }
        }

        return false;
    }

    const identyTernasAndCuartas = (cardsOfPlayer) =>{

        let numeroTernas = 0;
        let numeroCuartas = 0;
        const cardsValue = [];

        //IDENTIFICAR TERNA DE JUGADOR UNO
        cardsOfPlayer.map((cardItem) => {

            const cardValue = cardItem;
            //Buscamos si el valor de la carta ya esta en el Vector de las cartas ya evaluadas
            const findCardValue = cardsValue.find(
                card => card === cardValue.value
            )
            //Guardamos el valor de la carta
            if(!findCardValue) cardsValue.push(cardValue.value);
            //Guardamos dupublicados
            const duplicates = [];

            if(!findCardValue){
                cardsOfPlayer.map((cardItemTwo) =>{
                    if(cardValue.value === cardItemTwo.value){
                        duplicates.push(cardItemTwo);
                    }
                })
                console.log("ARRAY DE DUPLICADO");
                console.log(duplicates);

                if(duplicates.length === 3){
                    if(!identifyRepeated(duplicates)) numeroTernas += 1;
                } else if(duplicates.length === 4){
                    if(!identifyRepeated(duplicates)) numeroCuartas += 1;
                }
            }
        })

        console.log(cardsValue);
        console.log(numeroTernas);
        return {
            ternas: numeroTernas,
            cuartas: numeroCuartas
        }
    }

    const identyEscalera = (cardsOfPlayer) => {

        //Find card A
        let findCardA = cardsOfPlayer.find(card => card.value === "ACE");
        findCardA = findCardA == undefined ? false : true;

        //Find card J
        let findCardJ = cardsOfPlayer.find(card => card.value === "JACK");
        findCardJ = findCardJ == undefined ? false : true;

        //Find card Q
        let findCardQ = cardsOfPlayer.find(card => card.value === "QUEEN");
        findCardQ = findCardQ == undefined ? false : true;

        //Find card K
        let findCardK = cardsOfPlayer.find(card => card.value === "KING");
        findCardK = findCardK == undefined ? false : true;

        const cardsOrdenadas = cardsOfPlayer.sort((a, b) => a - b);

        let escaleras = 0;

        for (let i = 0; i < cardsOrdenadas.length; i++) {

            let cardNumber = Number(cardsOrdenadas[i].value);
            let cardNumberNext = Number(cardsOrdenadas[i + 1]?.value);
            let cardNumberNextTwo = Number(cardsOrdenadas[i + 2]?.value);

            if(findCardA && cardNumber == 2 && cardNumberNext == 3){
                escaleras = 1;
            }
            
            if((cardNumber - cardNumberNext) == -1 && (cardNumber - cardNumberNextTwo) == -2){
                escaleras = 1;
            }
            
            if(cardNumber == 9 && (cardNumber - cardNumberNext) == -1 && findCardJ){
                escaleras = 1;
            }
            
            if(cardNumber == 10 && findCardJ && findCardQ){
                escaleras = 1;
            }
            
            if(findCardJ && findCardQ && findCardK){
                escaleras = 1;
            }
        }
         
        return escaleras;
    }

    const playGame = async () =>{

        const resultIdGame = await DeckOfCardsAPI.getIdGame();
        setIdGame(resultIdGame);

        const cardsForPlayerOne = await DeckOfCardsAPI.getInitialCards(resultIdGame);
        const cardsForPlayerTwo = await DeckOfCardsAPI.getInitialCards(resultIdGame);
        
        const ternasAndCuartasPlayerOne = identyTernasAndCuartas(cardsForPlayerOne);
        const ternasAndCuartasPlayerTwo = identyTernasAndCuartas(cardsForPlayerTwo);

        ;

        setPlayerOne({...playerOne, cards: cardsForPlayerOne, ternas: ternasAndCuartasPlayerOne.ternas, cuartas: ternasAndCuartasPlayerOne.cuartas, 
                                                    escaleras: identyEscalera(cardsForPlayerOne)});
        setPlayerTwo({...playerTwo, cards: cardsForPlayerTwo, ternas: ternasAndCuartasPlayerTwo.ternas, cuartas: ternasAndCuartasPlayerTwo.cuartas,
                                                    escaleras: identyEscalera(cardsForPlayerTwo)});
        
        identifyWin();
    }

    const requestCards = async () =>{
        const dataCards = await DeckOfCardsAPI.getCards(idGame);

        let changeCardPlayerOne = true;
        let changeCardPlayerTwo = true;

        playerOne.cards.map((card, index) =>{

            const duplicates = [];

            playerOne.cards.map((cardItem) =>{
                if(cardItem.value === card.value){
                    duplicates.push(cardItem.value);
                }
            })

            if(duplicates.length <= 2 && changeCardPlayerOne){
                changeCardPlayerOne = false;

                let newCards = [...playerOne.cards];

                newCards.splice(index, 1);
                newCards.push(dataCards.cards[0]);
                
                console.log("Cambio de carta 1");

                const ternasAndCuartasPlayerOne = identyTernasAndCuartas(newCards);

                setPlayerOne({...playerOne, cards: newCards, ternas: ternasAndCuartasPlayerOne.ternas, cuartas: ternasAndCuartasPlayerOne.cuartas});
            }
        });

        playerTwo.cards.map((card, index) =>{

            const duplicates = [];

            playerTwo.cards.map((cardItem) =>{
                if(cardItem.value === card.value){
                    duplicates.push(cardItem.value);
                }
            })

            if(duplicates.length <= 2 && changeCardPlayerTwo){
                changeCardPlayerTwo = false;

                let newCards = [...playerTwo.cards];
                newCards.splice(index, 1);
                newCards.push(dataCards.cards[1]);
                
                console.log("Cambio de carta 2");

                const ternasAndCuartasPlayerTwo = identyTernasAndCuartas(newCards);

                setPlayerTwo({...playerTwo, cards: newCards, ternas: ternasAndCuartasPlayerTwo.ternas, cuartas: ternasAndCuartasPlayerTwo.cuartas});
            }
        });

        if(dataCards.remaining == 0){
            setShowToast(true);
            setWinName("EMPATE");
        } else {
            identifyWin();
        }
    }


    return (
    <GameContext.Provider value={{ playGame, requestCards, playerOne, setPlayerOne, 
                playerTwo, setPlayerTwo, showToast, setShowToast, winName }}>
        {children}
    </GameContext.Provider>
  )
}

export default GameProvider;

