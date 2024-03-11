import { Discord, Slash } from 'discordx';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ConfigManager } from '../utils/FormConfig';
import { i18n } from '../utils/i18n';

@Discord()
abstract class SetFormResponseChannel {
  @Slash({ name: "setformresponsechannel", description: i18n.__("setformresponsechannel.description") })
  async saveChannel(interaction: CommandInteraction): Promise<void> {

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply(i18n.__("setformresponsechannel.error.admin"));
        return;
    }

    if (!interaction.guildId || !interaction.channelId) {
      await interaction.reply(i18n.__("setformresponsechannel.error.guild"));
      return;
    }

    try {
      ConfigManager.setFormResponseConfig(interaction.guildId, interaction.channelId);
      await interaction.reply(i18n.__("setformresponsechannel.success", { channelId: interaction.channelId }));
    } catch (error) {
      console.error(i18n.__("setformresponsechannel.error.save"), error);
      await interaction.reply(i18n.__("setformresponsechannel.error.save"));
    }
  }
}
