
import { BotState } from './botState';
import { Standup } from './standup';

import { Message, User } from '../telegramTypes';

export class SetupStandup extends BotState{
	
	constructor(userID: (number | BotState), bot = null){
		super(userID, bot);
		this.chainResponse("Assuming daily standup. When do you want the standup to take place?");
		this.subState = 0;
	}

	private subState: number;

	private nextStandupDate: Date;
	private users: User[];


	public receiveMessage(msg: Message): BotState | Promise<BotState>{

		if(this.subState == 0){
			var date = this.getDate(msg.text);
			if(date != null){
				this.nextStandupDate = date;
				this.subState++;
				this.chainResponse("Everyone who is going to take part in the standup, send at least one message now. Send /done when done");
				this.users = [];
			}
			return null;
		}else if(this.subState == 1){
			if(/\/done/.test(msg.text)){
				this.subState++;
				var response = "";
				for(var user of this.users){
					response += user.first_name + ", ";
				}
				response = response.substr(0, response.length - 2);
				this.chainResponse("Added " + response + " to the standup; scheduling next standup session");

				var timeout = this.nextStandupDate.getTime() - Date.now();
				if(timeout < 0) timeout = 0;

				return new Promise<BotState>((resolve, reject) => {
					setTimeout((self: SetupStandup) => {
						resolve(new Standup(self, null, self.users));
					}, timeout, this);
				});

			}else{
				var participant = msg.from;
				for(var i = 0; i < this.users.length; i++){
					if(this.users[i].id == participant.id){
						return null;
					}
				}

				this.users.push(participant);
				this.chainResponse("Added " + (msg.from.username || msg.from.first_name));
			}
		}
		return null;
	}


	private getDate(message: string){

		var timeMatch = /(\d{2}):(\d{2})(:(\d{2}))?/
		var match = timeMatch.exec(message);
		if(match == null){
			this.sendResponse("Please format time as HH:MM<:SS> on a 24 hour clock");
			console.log(message);
			return null;
		}

		var hour = Number(match[1]);
		var minute = Number(match[2]);
		var second = (match[4]) ? Number(match[4]) : 0;

		if(hour > 24 || minute > 60 || second > 60){
			this.sendResponse("Please use a valid time");
			return null;
		}

		var standupDate = new Date();
		standupDate = new Date(standupDate.getFullYear(), standupDate.getMonth(), standupDate.getDate(),
		 hour, minute, second);

		this.chainResponse("Setting standup to " + standupDate.toString());
		return standupDate;
	}

	private getParticipant(msg){

	}
}