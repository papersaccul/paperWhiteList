import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { i18n } from "../utils/i18n";

@Discord()
abstract class RandomCommand {

    @Slash({ name: "randomnumber", description: i18n.__("randomnumber.description") })
    async generateRandomNumber(
        @SlashOption({
            name: "min", 
            description: i18n.__("randomnumber.min.description"), 
            required: true, 
            type: ApplicationCommandOptionType.Integer
        })
        min: number,

        @SlashOption({ 
            name: "max", 
            description: i18n.__("randomnumber.max.description"), 
            required: true, 
            type: ApplicationCommandOptionType.Integer
        })
        max: number,
        interaction: CommandInteraction

    ): Promise<void> {
        if (!Number.isInteger(min) || !Number.isInteger(max)) {
            await interaction.reply(i18n.__("randomnumber.error.integer"));
            return;
        }

        if (min >= max) {
            await interaction.reply(i18n.__("randomnumber.error.minmax"));
            return;
        }

        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        await interaction.reply(`${randomNumber}`);
    }
}