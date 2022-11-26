import { Client, Interaction, VoiceState } from 'discord.js';
import * as commandModules from './commands/commandFiles';

/**
 * EventHandler handles all Discord events in one place by taking a Discord client and attaches
 * listeners to specific events on the client. Each method is an particular event found from
 * this list: https://discord-ts.js.org/docs/general/events/
 * More information about events found here:
 * https://github.com/amishshah/discord.js-guide/blob/master/development/understanding-events.md
 */
class EventHandler {
  private client: Client<boolean>;
  private commands: any;

  /**
   * @param client Discord client instance
   */
  constructor(client: Client<boolean>) {
    this.client = client;
    this.commands = Object(commandModules);
  }

  /**
   * This method initialises all the listeners for the events that we're interested in
   * If you want to add a new event, make sure to invoke the method here
   * Otherwise, the event won't be listened to
   */
  initEvents() {
    this.ready();
    this.voiceStateUpdate();
    this.interactionCreate();
  }

  /**
   * When the client is ready, this event is triggered
   */
  ready() {
    this.client.once('ready', () => {
      console.log('READY');
    });
  }

  voiceStateUpdate() {
    const userIdToMove = '253990003171000320';
    const forbiddenChannelId = '499707989784264704';

    this.client.on(
      'voiceStateUpdate',
      (oldState: VoiceState, newState: VoiceState) => {
        if (oldState.channelId === null) {
          return;
        }

        const member = oldState.member;
        if (
          newState.channelId === forbiddenChannelId &&
          member?.id === userIdToMove
        ) {
          member?.voice.setChannel(oldState.channel);
        }
      }
    );
  }

  /**
   * When a message from a user that is a command
   */
  async interactionCreate() {
    this.client.on('interactionCreate', (interaction: Interaction) => {
      if (!interaction.isCommand()) {
        return;
      }

      const { commandName } = interaction;
      this.commands[commandName].execute(interaction, this.client);
    });
  }
}

export default EventHandler;
