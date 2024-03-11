import { CommandInteraction, ChannelType, EmbedBuilder, ButtonBuilder, 
         ButtonStyle, ActionRowBuilder, PermissionFlagsBits} from "discord.js";
import { Discord, Slash} from "discordx";
import * as dotenv from 'dotenv';
import { i18n } from '../utils/i18n';

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

    @Slash({ name: "setup", description: i18n.__("setup.description") })
    async setup(interaction: CommandInteraction): Promise<void> {
        
        await interaction.deferReply();
        
        let applyChannel = await interaction.guild?.channels.fetch(interaction.channelId);
        if (!applyChannel || applyChannel.type !== ChannelType.GuildText) {
            await interaction.editReply(i18n.__("setup.channelNotFound"));
            return;
        }

        if (interaction.memberPermissions?.has(PermissionFlagsBits.ManageRoles)) {

            let btnWhiteList = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("ap_apply")
                    .setLabel(i18n.__("setup.fillForm"))
                    .setEmoji("📑"),

            );

            await applyChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#00e5ff")
                        .setThumbnail("https://cdn.discordapp.com/attachments/762837041955733554/1216395187090231346/chilltown_logo_trsp.png?ex=66003b4c&is=65edc64c&hm=4983b5fb8150f7007f91f2d70dea86e72ed81b35d85b6621902f77f74ccb2bdf&")
                        .setTitle(i18n.__("setup.joinInstructions"))
                ],
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
