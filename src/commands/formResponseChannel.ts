import { Discord, Slash, SlashGroup } from 'discordx';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ConfigManager } from '../utils/FormConfig';
import { i18n } from '../utils/i18n';

@Discord()
@SlashGroup("set")
abstract class SetFormResponseChannel {
  @Slash({ name: "responsechannel", description: i18n.__("setformresponsechannel.description") })
  async saveChannel(interaction: CommandInteraction): Promise<void> {

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({ content: i18n.__("setformresponsechannel.error.admin"), ephemeral: true });
        return;
    }

    if (!interaction.guildId || !interaction.channelId) {
      await interaction.reply({ content: i18n.__("setformresponsechannel.error.guild"), ephemeral: true });
      return;
    }

    try {
      ConfigManager.updateFormResponseConfig(interaction.guildId, { channelId: interaction.channelId });
      await interaction.reply({ content: i18n.__("setformresponsechannel.success", { channelId: interaction.channelId }) });
    } catch (error) {
      console.error("Error saving form response channel configuration:", error);
      await interaction.reply({ content: i18n.__("setformresponsechannel.error.save"), ephemeral: true });
    }
  }
}
