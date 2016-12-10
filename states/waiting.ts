
import { BotState } from './botState';
import { SetupStandup } from './setupStandup';

export class Waiting extends BotState{
	
	constructor(userID: (number | BotState), bot = null){
		super(userID, bot);
	}
	
	public receiveMessage(msg): BotState{

		var message = "";

		var text = msg.text;

		var match;
		if((match = /\/initStandup/.exec(text)) != null){

			this.sendResponse("Initializing the standup");
			return new SetupStandup(this);
		}
		return null;
	}
}