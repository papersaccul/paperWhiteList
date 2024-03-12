import { CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType, Role} from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';
import { ConfigManager } from '../utils/FormConfig';
import { i18n } from '../utils/i18n';

@Discord()
@SlashGroup({ name: "set", description: i18n.__("setrole.set.description") })

@SlashGroup("set")
abstract class SetRoleCommands {
  @Slash({ name: "acceptrole", description: i18n.__("setrole.accept.description") })
  async setAcceptRole(
    @SlashOption({ name: "role", description: i18n.__("setrole.role.description"), type: ApplicationCommandOptionType.Role })
    acceptRoleId: Role,
    interaction: CommandInteraction
  ): Promise<void> {

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply(i18n.__("setrole.error.admin"));
      return;
    }

    if (!interaction.guildId) {
      await interaction.reply(i18n.__("setrole.error.guild"));
      return;
    }

    try {
      ConfigManager.updateFormResponseConfig(interaction.guildId, { acceptRoleId: acceptRoleId.id });
      await interaction.reply(i18n.__("setrole.accept.success", { roleId: acceptRoleId.id }));
    } catch (error) {
      console.error(i18n.__("setrole.error.save"), error);
      await interaction.reply(i18n.__("setrole.error.save"));
    }
  }

  @Slash({ name: "rejectrole", description: i18n.__("setrole.reject.description") })
  async setRejectRole(
    @SlashOption({ name: "role", description: i18n.__("setrole.role.description"), type: ApplicationCommandOptionType.Role })
    rejectRoleId: Role,
    interaction: CommandInteraction
  ): Promise<void> {

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply(i18n.__("setrole.error.admin"));
      return;
    }

    if (!interaction.guildId) {
      await interaction.reply(i18n.__("setrole.error.guild"));
      return;
    }

    try {
      ConfigManager.updateFormResponseConfig(interaction.guildId, { rejectRoleId: rejectRoleId.id });
      await interaction.reply(i18n.__("setrole.reject.success", { roleId: rejectRoleId.id }));
    } catch (error) {
      console.error(i18n.__("setrole.error.save"), error);
      await interaction.reply(i18n.__("setrole.error.save"));
    }
  }
}