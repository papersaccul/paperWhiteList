import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

@Discord()
abstract class InviteCommand {

    @Slash("invite", { description: "Выдать роль и отправить приглашение." })
    async invite(
        @SlashOption("user", { description: "Пользователь для приглашения.", required: true })
        user: GuildMember,
        interaction: CommandInteraction
    ): Promise<void> {
        const member = user;
        
        if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
            await interaction.reply("Эта команда доступна только администраторам.");
            return;
        }
        
        let errorMessage = "";
        try {
            await member.roles.add("1208178813058682921");  //  1216038312167473192
        } catch (error) {
            errorMessage = ", но произошла ошибка при добавлении роли.";
            console.error(error);
        }
        
        const embed = new MessageEmbed()
            .setTitle("Вас приняли в ChillTown.")
            .setDescription(`На первое время вам выдан вид на жительство. \n Не забудьте принять приглашение в город в [личном кабинете](https://dreamscape.su/pc/) \n\n Так же ознакомьтесь с форумом <#1213190922284568597>`)
            .setColor("#ff0000");
        
        await member.send({ embeds: [embed] });
        
        await interaction.reply(`Вид на жительство выдан, инструкция отправлена игроку ${member.displayName} (${member.toString()})${errorMessage}`);
    }
}


