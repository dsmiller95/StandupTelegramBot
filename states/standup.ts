
import { BotState } from './botState';
import { SetupStandup } from './setupStandup';
import { Waiting } from './waiting';


import { Message, User } from '../telegramTypes';

export class Standup extends BotState{
	
	private participants: User[];

	constructor(userID: (number | BotState), bot = null, participants: User[]){
		super(userID, bot);
		this.sendResponse("STANDUP TIME, " + participants.length + " participants required!");
		this.participants = participants;
		setTimeout((self: Standup) => {
			self.reprimand();
		}, 1000 * 60, this);
	}
	
	private reprimand(){
		if(this.participants.length > 0){

			var response = "";
			for(var user of this.participants){
				response += user.first_name + ", ";
			}
			response = response.substr(0, response.length - 2);
			this.sendResponse("Not everyone has reported in yet; please report in " + response);
			setTimeout((self: Standup) => {
				self.reprimand();
			}, 1000 * 60, this);
		}
	}

	public receiveMessage(msg: Message): BotState{

		var message = "";

		if(this.participants.length < 0){
			return new Waiting(this);
		}
		
		for(var i = 0; i < this.participants.length; i++){
			if(this.participants[i].id == msg.from.id){
				this.participants.splice(i, 1);
				return null;
			}
		}

		var text = msg.text;

		

		return null;
	}
}