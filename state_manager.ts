
import { BotState } from './states/botState';
import { Waiting } from './states/waiting';

import { Message } from './telegramTypes';

export enum State{
	Begin = 0,
	Console,
	Emergency
}

class StateObj{
	private state: BotState;
	public lastTouched: number;
	constructor(state: BotState){
		this.state = state;
		this.lastTouched = Date.now();
	}
	getState() : BotState{
		this.lastTouched = Date.now();
		return this.state;
	}
	delegateMessage(message){
		this.lastTouched = Date.now();
		var result = this.state.receiveMessage(message);
		if(result != null){
			if(result instanceof BotState){
				this.state = result;
			}else{
				result.then((state) => {
					this.state = state;
				})
			}
		}
	}
	setState(state: BotState): void{
		this.state = state;
		this.lastTouched = Date.now();
	}
}


export class StateManager{


	private currentStates: {[chatID: string]: StateObj};
	private statePermanance: number;
	private bot;
	private garbageCollector;
    
    /*
     * statePermanance: number of ms till clearing the last know state. -1 for never
    */
	constructor(statePermanance: number, bot){
		this.currentStates = {};
		this.statePermanance = statePermanance;
		this.garbageCollector = setInterval((obj: StateManager) => {
			var time = Date.now();
			for (var key in obj.currentStates) {
				if (obj.currentStates.hasOwnProperty(key)) {
					var state = obj.currentStates[key];
					if(time > state.lastTouched){
						delete obj.currentStates[key];
					}
				}
			}
		}, statePermanance/2);
		this.bot = bot;
	}

	public dispose(): void{
		clearInterval(this.garbageCollector);
		delete this.currentStates;
	}

	public forceStateChange(chatID: number, newState: BotState){

	}

	/*public getState(userID: string): State{
		if(userID in this.currentStates){
			return this.currentStates[userID].getState();
		}else{
			this.currentStates[userID] = new StateObj(State.Begin);
			return State.Begin;
		}
	}

	public setState(userID: string, state: State): void{
		if(userID in this.currentStates){
			this.currentStates[userID].setState(state);
		}else{
			this.currentStates[userID] = new StateObj(state);
		}
	}*/

	public delegateMessge(chatID: number, message: Message): void{
		if(!(chatID in this.currentStates)){
			this.currentStates[chatID] = new StateObj(new Waiting(chatID, this.bot));
		}
		this.currentStates[chatID].delegateMessage(message);
	}
}