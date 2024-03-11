import { CommandInteraction, Message, EmbedBuilder } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
abstract class PingCommand {

    @Slash({ name: "ping", description: "Проверить задержку" })
    async ping(interaction: CommandInteraction): Promise<void> {
        const reply = (await interaction.deferReply({ fetchReply: true })) as Message;
        const embed = new EmbedBuilder()
                .setTitle("Ping result")
                .addFields(
                    { name: "Roundtrip", value: `\`\`\`${reply.createdTimestamp - interaction.createdTimestamp} ms\`\`\``, inline: true },
                    { name: "WebSocket", value: `\`\`\`${interaction.client.ws.ping} ms\`\`\``, inline: true }
                )
                .setColor("#00ff7f");
        interaction.editReply({ embeds: [embed] });
    }
}