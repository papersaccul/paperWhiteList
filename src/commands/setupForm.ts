import { CommandInteraction, ChannelType, EmbedBuilder, ButtonBuilder, 
         ButtonStyle, ActionRowBuilder, PermissionFlagsBits,
         ColorResolvable} from "discord.js";
import { Discord, Slash} from "discordx";
import * as dotenv from 'dotenv';
import { i18n } from '../utils/i18n';
import formCT from '../cfg/FormWhiteList.json'; // Добавлен импорт данных из JSON

dotenv.config();

interface Config {
    FormResponse?: {
        [guildId: string]: {
            channelId: string;
        };
    };
}

@Discord()
abstract class SetupCommand {

    @Slash({ name: "setupform", description: i18n.__("setup.description") })
    async setup(interaction: CommandInteraction): Promise<void> {
        
        await interaction.deferReply();
        
        let applyChannel = await interaction.guild?.channels.fetch(interaction.channelId);
        if (!applyChannel || applyChannel.type !== ChannelType.GuildText) {
            await interaction.editReply(i18n.__("setup.channelNotFound"));
            return;
        }

        if (interaction.memberPermissions?.has(PermissionFlagsBits.ManageRoles)) {

            let buttonBuilder = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("ap_apply")
                .setLabel(formCT.modal.buttonLabel || i18n.__("setup.fillForm"));

            if (formCT.modal.buttonEmoji) {
                buttonBuilder.setEmoji(formCT.modal.buttonEmoji);
            }

            let btnWhiteList = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonBuilder);

            let embed = new EmbedBuilder()
                .setColor(formCT.modal.color as ColorResolvable || "#00e5ff")
                .setTitle(formCT.modal.joinInstructions || i18n.__("setup.joinInstructions"));

            if (formCT.modal.thumbnail) {
                embed.setThumbnail(formCT.modal.thumbnail);
            }

            await applyChannel.send({
                embeds: [embed],
                components: [btnWhiteList],
            });

            await interaction.editReply({
                content: i18n.__("setup.setupComplete", { channel: applyChannel.name }),
            });

        } else {
            await interaction.editReply({
                content: i18n.__("setup.noPermission"),
            });
        }
    }

    
}