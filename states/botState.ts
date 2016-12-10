
import { Message } from '../telegramTypes';

export abstract class BotState{
	
	protected bot;
	protected chatID: number;

	constructor(userID: (number | BotState), bot = null){
		if(userID instanceof BotState){
			this.bot = userID.bot;
			this.chatID = userID.chatID;
		}else{
			console.log("userID string");
			this.bot = bot;
			this.chatID = userID;
		}
		this.waitingMessages = [];
	}

	public abstract receiveMessage(msg: Message): BotState | Promise<BotState>;

	protected sendResponse(message: string): Promise<any>{
  		return this.bot.sendMessage(this.chatID, message);
	}

	private lastResponse: Promise<any> | false;
	private waitingMessages: string[];

	protected chainResponse(message: string){
		if(this.lastResponse){
			this.waitingMessages.push(message);
		}else{
			this.lastResponse = this.sendResponse(message).then((stuff) => {
				this.pullChainResponse();
			})
		}
	}

	private pullChainResponse(){
		if(this.waitingMessages.length > 0){
			this.lastResponse = this.sendResponse(this.waitingMessages.shift())
				.then(() => {
					this.pullChainResponse();
				});
		}else{
			this.lastResponse = false;
		}
	}

}