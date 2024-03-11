import { ButtonInteraction, ModalSubmitInteraction, MessageComponentInteraction, ModalBuilder } from "discord.js";
import { Discord, ButtonComponent, ModalComponent } from "discordx";
import { ConfigManager } from '../utils/FormConfig';
import { i18n } from '../utils/i18n';
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

@Discord()
abstract class ModalHandlers {
@ButtonComponent({ id: "ap_apply" })
    async handleApplyButton(interaction: ButtonInteraction): Promise<void> {

            const modal = new ModalBuilder()
                .setTitle(i18n.__("modal.title"))
                .setCustomId("CTform")
    
            const nickInputComponent = new TextInputBuilder()
                .setCustomId("nickField")
                .setLabel(i18n.__("modal.nickLabel"))
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(i18n.__("modal.nickPlaceholder"))
    
            const ageInputComponent = new TextInputBuilder()
                .setCustomId("ageField")
                .setLabel(i18n.__("modal.ageLabel"))
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(i18n.__("modal.agePlaceholder"))
    
            const weekOnlineComponent = new TextInputBuilder()
                .setCustomId("weekOnlineField")
                .setLabel(i18n.__("modal.weekOnlineLabel"))
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(i18n.__("modal.weekOnlinePlaceholder"))
    
            const didKnowComponent = new TextInputBuilder()
                .setCustomId("didKnowField")
                .setLabel(i18n.__("modal.didKnowLabel"))
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(i18n.__("modal.didKnowPlaceholder"))
    
            const beDoingComponent = new TextInputBuilder()
                .setCustomId("beDoingField")
                .setLabel(i18n.__("modal.beDoingLabel"))
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(i18n.__("modal.beDoingPlaceholder"))
    
            const rows = [
                new ActionRowBuilder<TextInputBuilder>().addComponents(nickInputComponent),
                new ActionRowBuilder<TextInputBuilder>().addComponents(ageInputComponent),
                new ActionRowBuilder<TextInputBuilder>().addComponents(weekOnlineComponent),
                new ActionRowBuilder<TextInputBuilder>().addComponents(didKnowComponent),
                new ActionRowBuilder<TextInputBuilder>().addComponents(beDoingComponent),
            ];

            modal.addComponents(...rows);
    
            interaction.showModal(modal);
    }
    @ModalComponent({ id: "CTform" })
    async handleCTform(interaction: ModalSubmitInteraction): Promise<void> {
        const guildId = interaction.guildId;
        const channelId = ConfigManager.getFormResponseConfig(guildId as string);

        if (!channelId) {
            await interaction.reply({ content: i18n.__("modal.channelNotFound"), ephemeral: true });
            return;
        }

        const channel = await interaction.guild?.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) {
            await interaction.reply({ content: i18n.__("modal.channelNotAccessible"), ephemeral: true });
            return;
        }

        const fields = interaction.fields;
        const embed = new EmbedBuilder()
            .setTitle(i18n.__("modal.newApplication"))
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() ?? undefined })            
            .setFooter({ text: i18n.__("modal.userFooter", { id: interaction.user.id }) })
            .addFields(
                { name: i18n.__("modal.nickField"), value: fields.getTextInputValue("nickField"), inline: true },
                { name: i18n.__("modal.ageField"), value: fields.getTextInputValue("ageField"), inline: true },
                { name: i18n.__("modal.weekOnlineField"), value: fields.getTextInputValue("weekOnlineField"), inline: true },
                { name: i18n.__("modal.didKnowField"), value: fields.getTextInputValue("didKnowField"), inline: true },
                { name: i18n.__("modal.beDoingField"), value: fields.getTextInputValue("beDoingField"), inline: true }
            )
            .setColor("#0099ff");
        const acceptButton = new ButtonBuilder()
            .setCustomId(`accept_${interaction.user.id}`)
            .setLabel(i18n.__("modal.accept"))
            .setStyle(ButtonStyle.Success);

        const rejectButton = new ButtonBuilder()
            .setCustomId(`reject_${interaction.user.id}`)
            .setLabel(i18n.__("modal.reject"))
            .setStyle(ButtonStyle.Danger);

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(acceptButton, rejectButton);

        await channel.send({ embeds: [embed], components: [actionRow] });

        await interaction.reply({
            content: i18n.__("modal.applicationSubmitted"),
            ephemeral: true,
        });
        const messageId = channel.lastMessageId;

        const filter = (i: MessageComponentInteraction) => {
            return i.isButton() && 
                   (i.customId.includes(`accept_`) || i.customId.includes(`reject_`)) && 
                   i.message.id === messageId;
        };

        const collector = channel.createMessageComponentCollector({ filter, time: 6000000 });

        collector.on('collect', async i => {
            if (!i.isButton()) return;
            const [action, userId] = i.customId.split('_');
            const user = await i.client.users.fetch(userId);
            const guildMember = await interaction.guild?.members.fetch(userId);
            const message = i.message;
            let embed;

            if (action === 'accept') {
                await message.edit({ content: i18n.__("modal.playerAccepted", { userId: userId }), components: [] });

                const role = interaction.guild?.roles.cache.find(r => r.id === "1208178813058682921"); // роль вида на жительство
                if (role) {
                    await guildMember?.roles.add(role).catch(console.error);
                }

                embed = new EmbedBuilder()
                    .setTitle(i18n.__("modal.applicationAccepted"))
                    .setDescription(i18n.__("modal.acceptedDescription"))
                    .setColor("#00FF00");
            } else if (action === 'reject') {
                await message.edit({ content: i18n.__("modal.applicationRejected", { userId: userId }), components: [] });
                
                const role = interaction.guild?.roles.cache.find(r => r.id === "1216833211498238003"); // роль непринятой заявки
                if (role) {
                    await guildMember?.roles.add(role).catch(console.error);
                }

                embed = new EmbedBuilder()
                    .setTitle(i18n.__("modal.applicationDenied"))
                    .setDescription(i18n.__("modal.deniedDescription"))
                    .setColor("#FF0000");
            }

            if (embed) {
                await user.send({ embeds: [embed] }).catch(console.error);
            } else {
                console.error(i18n.__("modal.undefinedEmbedError"));
            }        
        });
    }
}

