import { Discord, Slash } from 'discordx';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ConfigManager } from '../utils/FormConfig';

@Discord()
abstract class SetFormResponseChannel {
  @Slash({ name: "setformresponsechannel", description: "Сохранить ID канала формы" })
  async saveChannel(interaction: CommandInteraction): Promise<void> {

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply("Эта команда доступна только с правами Administrator.");
        return;
    }

    if (!interaction.guildId || !interaction.channelId) {
      await interaction.reply('Эта команда может быть использована только внутри гильдии.');
      return;
    }

    try {
      ConfigManager.setFormResponseConfig(interaction.guildId, interaction.channelId);
      await interaction.reply(`Канал для формы успешно сохранен: ${interaction.channelId}`);
    } catch (error) {
      console.error('Ошибка при сохранении канала для формы:', error);
      await interaction.reply('Произошла ошибка при сохранении канала для формы.');
    }
  }
}
