export interface User{
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
}

export interface Message{
	message_id: number;
	from?: User;
	date: number;
	chat: Chat;
	forward_from?: User;
	forward_from_message_id?: number;
	forward_date?: number;
	text?: string;
}

export interface Chat{
	id: number;
	type: string;
	title?: string;
	username?: string;
	first_name?: string;
	last_name?: string;
	all_members_are_administrators?: boolean;
}