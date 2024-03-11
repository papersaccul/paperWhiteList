import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

@Discord()
abstract class RandomCommand {

    @Slash({ name: "randomnumber", description: "Сгенерировать случайное число." })
    async randomnumber(
        @SlashOption({
            name: "min", 
            description: "Наименьшее число для генерации.", 
            required: true, 
            type: ApplicationCommandOptionType.Integer
        })
        min: number,

        @SlashOption({ 
            name: "max", 
            description: "Наибольшее число для генерации.", 
            required: true, 
            type: ApplicationCommandOptionType.Integer
        })
        max: number,
        interaction: CommandInteraction

    ): Promise<void> {
        if (!Number.isInteger(min) || !Number.isInteger(max)) {
            await interaction.reply("И минимальное значение, и максимальное значение должны быть целыми числами.");
            return;
        }

        if (min > max) {
            await interaction.reply("Минимальное значение должно быть меньше или равно максимальному значению.");
            return;
        }

        const draw = Math.trunc(Math.random() * (max - min) + min);
        await interaction.reply(`${draw}`);
    }
}