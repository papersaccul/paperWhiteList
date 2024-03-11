import { CommandInteraction, Message, EmbedBuilder } from "discord.js";
import { Discord, Slash } from "discordx";
import { i18n } from "../utils/i18n";

@Discord()
abstract class PingCommand {

    @Slash({ name: "ping", description: i18n.__("ping.description") })
    async ping(interaction: CommandInteraction): Promise<void> {
        const reply = (await interaction.deferReply({ fetchReply: true })) as Message;
        const embed = new EmbedBuilder()
                .setTitle(i18n.__("ping.title"))
                .addFields(
                    { name: i18n.__("ping.roundtrip"), value: `\`\`\`${reply.createdTimestamp - interaction.createdTimestamp} ms\`\`\``, inline: true },
                    { name: i18n.__("ping.websocket"), value: `\`\`\`${interaction.client.ws.ping} ms\`\`\``, inline: true }
                )
                .setColor("#00ff7f");
        interaction.editReply({ embeds: [embed] });
    }
}