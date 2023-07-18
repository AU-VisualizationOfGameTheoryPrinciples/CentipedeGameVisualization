/**
 * Centipede Strategy sets how urgent the agent is to finish the game at a certain point in game
 *  - EGO: wants to win the most, so according to Backwards Induction, finishing the game early to win
 *  - CASUAL: wants to get some payoff before finishing
 *  - SOCIAL: wants both players to get some payoff, so honors most likely at the end
 */
const Centipede_Strategy_Types = { EGO: "EGO", CASUAL: "CASUAL", SOCIAL: "SOCIAL" };
const CENTI_TYPES = [Centipede_Strategy_Types.EGO, Centipede_Strategy_Types.CASUAL, Centipede_Strategy_Types.SOCIAL];

var endingRound;
var agent;

function setupAgent(ending_round) {
    setEndingRound(ending_round);
    agent = new Centipede_Agent(2);
    return agent;
}

/**
 * set last round/turn for agent to consider if they want to honor or defect
 * @param {number} ending_round 
 */
function setEndingRound(ending_round) {
    endingRound = ending_round;
}

class Centipede_Agent {
    id;
    score;  // score how accurate the predictions are
    strategy; // Centipede Strategy sets how urgent the agent is to finish the game at a certain point in game

    constructor(id) {
        this.id = id;
        let type = CENTI_TYPES[generateRandomNumber(3)-1];
        this.strategy = new Centipede_Strategy(id, type);
    }

    get_decision(turn) {
        return this.strategy.get_decision(turn);
    }

}

class Centipede_Strategy {
    player_id;
    first_percentage; // percentage of finishing right at the first chance
    mid_percentage; // percentage of finishing in between start and end
    end_percentage; // percentage of defecting at the last turn
    type;

    constructor(player_id, type) {
        this.player_id = player_id;
        this.type = type;
        this.set_strategy_percentages();
    }

    set_strategy_percentages() {
        switch (this.type) {
            case Centipede_Strategy_Types.EGO:
                this.first_percentage = 55;
                this.mid_percentage = 70;
                this.end_percentage = 100;
                break;
            case Centipede_Strategy_Types.CASUAL:
                this.first_percentage = 35;
                this.mid_percentage = 45;
                this.end_percentage = 55;
                break;
            case Centipede_Strategy_Types.SOCIAL:
                this.first_percentage = 20;
                this.mid_percentage = 30;
                this.end_percentage = 10;
                break;
        }
    }

    get_decision(turn) {
        if (turn == this.player_id - 1) {
            return generateRandomNumber(100) <= this.first_percentage;
        }
        else if (turn == endingRound) {
            return generateRandomNumber(100) <= this.end_percentage;
        } else {
            let inbetweenPercentage = this.mid_percentage;
            if(turn < endingRound/2){
                inbetweenPercentage-=10;
            } else if(turn > endingRound/2){
                inbetweenPercentage+=10;
            }
            return generateRandomNumber(100) <= inbetweenPercentage;
        }
    }
}

function generateRandomNumber(maxNumber) {
    let rand = Math.floor(Math.random() * maxNumber) + 1;
    console.log(rand); 
    return rand;
}

export { setupAgent };