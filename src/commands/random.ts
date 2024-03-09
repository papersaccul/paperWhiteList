import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";

@Discord()
@SlashGroup("random")
abstract class RandomCommands {

    @Slash("number", { description: "Generate a random number." })
    async random(
        @SlashOption("min", { description: "The smallest number to be generated.", required: true })
        min: number,
        @SlashOption("max", { description: "The largest number to be generated.", required: true })
        max: number,
        interaction: CommandInteraction
    ): Promise<void> {
        if (!Number.isInteger(min) || !Number.isInteger(max)) {
            await interaction.reply("Both the minimum value and the maximum value must be integers.");
            return;
        }

        if (min > max) {
            await interaction.reply("The minimum value must be smaller or equal to the maximum value.");
            return;
        }

        const draw = Math.trunc(Math.random() * (max - min) + min);
        await interaction.reply(`${draw}`);
    }
}