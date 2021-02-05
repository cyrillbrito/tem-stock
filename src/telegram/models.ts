
export interface GetUpdates {
  ok: boolean;
  result: Update[];
}

export interface Update {
  update_id: number;
  message: Message;
}

export interface Message {
  message_id: number;
  chat: Chat;
  text: string;
}

export interface Chat {
  id: number;
}

export interface SendMessage {
  chat_id: number;
  text: string;
  reply_to_message_id?: number;
  parse_mode?: "MarkdownV2";
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
}

export interface SetWebhook {
  url: string;
  drop_pending_updates: boolean
}

export interface SetMyCommands {
  commands: BotCommand[];
}

export interface BotCommand {
  command: string;
  description: string;
}
