import { ButtonInteraction, ModalSubmitInteraction, MessageComponentInteraction, ModalBuilder,
         TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Discord, ButtonComponent, ModalComponent } from "discordx";
import { ConfigManager } from '../utils/FormConfig';
import { i18n } from '../utils/i18n';
import * as formCT from '../cfg/FormWhiteList.json';

@Discord()
abstract class ModalHandlers {
    @ButtonComponent({ id: "ap_apply" })
    async handleApplyButton(interaction: ButtonInteraction): Promise<void> {
        const guildId = interaction.guildId;
        const formConfig = ConfigManager.getFormResponseConfig(guildId as string);
        if (!formConfig) {
            await interaction.reply({ content: i18n.__("modal.configNotFound"), ephemeral: true });
            return;
        }
        const modalData = formCT.modal;
        const modal = new ModalBuilder()
            .setTitle(modalData.title)
            .setCustomId("CTform");

        const rows = modalData.components.flatMap(component =>
            component.components.filter(comp => comp.type === 4)
                .map(comp => {
                    const textInput = new TextInputBuilder()
                        .setCustomId(comp.custom_id)
                        .setLabel(comp.label)
                        .setStyle(TextInputStyle[comp.style as keyof typeof TextInputStyle] || TextInputStyle.Short)
                        .setMaxLength(Number(comp.max_length) || 512)
                        .setPlaceholder(comp.placeholder)
                        .setRequired(comp.required || false);
                    return new ActionRowBuilder<TextInputBuilder>().addComponents(textInput);
                })
        );

        modal.addComponents(...rows);

        interaction.showModal(modal);
    }

    @ModalComponent({ id: "CTform" })
    async handleCTform(interaction: ModalSubmitInteraction): Promise<void> {
        const guildId = interaction.guildId;
        const formConfig = ConfigManager.getFormResponseConfig(guildId as string);

        if (!formConfig || !formConfig.channelId) {
            await interaction.reply({ content: i18n.__("modal.channelNotFound"), ephemeral: true });
            return;
        }

        const channel = await interaction.guild?.channels.fetch(formConfig.channelId);
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
                formCT.modal.components.flatMap(component => 
                    component.components.map(comp => 
                        ({ name: comp.label, value: fields.getTextInputValue(comp.custom_id), inline: true })
                    )
                )
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

        const collector = channel.createMessageComponentCollector({ filter, time: 0 });

        collector.on('collect', async i => {
            if (!i.isButton()) return;
            const [action, userId] = i.customId.split('_');
            const user = await i.client.users.fetch(userId);
            const guildMember = await interaction.guild?.members.fetch(userId);
            const message = i.message;
            let embed;

            if (action === 'accept') {
                await message.edit({ content: i18n.__("modal.playerAccepted", { userId: userId }), components: [] });

                if (formConfig.acceptRoleId) {
                    const role = interaction.guild?.roles.cache.get(formConfig.acceptRoleId);
                    if (role) {
                        await guildMember?.roles.add(role).catch(console.error);
                    }
                }

                embed = new EmbedBuilder()
                    .setTitle(i18n.__("modal.applicationAccepted"))
                    .setDescription(i18n.__("modal.acceptedDescription"))
                    .setColor("#00FF00");
            } else if (action === 'reject') {
                await message.edit({ content: i18n.__("modal.applicationRejected", { userId: userId }), components: [] });
                
                if (formConfig.rejectRoleId) {
                    const role = interaction.guild?.roles.cache.get(formConfig.rejectRoleId);
                    if (role) {
                        await guildMember?.roles.add(role).catch(console.error);
                    }
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
