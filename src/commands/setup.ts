import { CommandInteraction, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, 
         ModalBuilder, ButtonInteraction, TextInputBuilder, TextInputStyle, ModalSubmitInteraction, MessageComponentInteraction} from "discord.js";
import { Discord, Slash, ButtonComponent, ModalComponent } from "discordx";
import * as dotenv from 'dotenv';
import { ConfigManager } from '../utils/FormConfig';

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

    @Slash({ name: "setup", description: "Настроить канал для подачи заявок" })
    async setup(interaction: CommandInteraction): Promise<void> {
        
        await interaction.deferReply();
        
        let applyChannel = await interaction.guild?.channels.fetch(interaction.channelId);
        if (!applyChannel || applyChannel.type !== ChannelType.GuildText) {
            await interaction.editReply("Канал для подачи заявок не найден или не является текстовым каналом.");
            return;
        }

        if (interaction.memberPermissions?.has(PermissionFlagsBits.ManageRoles)) {

            let btnWhiteList = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("ap_apply")
                    .setLabel("Заполнить анкету")
                    .setEmoji("📑"),

            );

            await applyChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#00e5ff")
                        .setThumbnail("https://cdn.discordapp.com/attachments/762837041955733554/1216395187090231346/chilltown_logo_trsp.png?ex=66003b4c&is=65edc64c&hm=4983b5fb8150f7007f91f2d70dea86e72ed81b35d85b6621902f77f74ccb2bdf&")
                        .setTitle(`Для вступления - заполните небольшую анкету ниже.`)
                ],
                components: [btnWhiteList],
            });

            await interaction.editReply({
                content: `> Настройка выполнена в канале ${applyChannel}`,
            });

        } else {
            await interaction.editReply({
                content: `У вас нет прав для выполнения этой команды.`,
            });
        }
    }

    @ButtonComponent({ id: "ap_apply" })
    async handleApplyButton(interaction: ButtonInteraction): Promise<void> {

            const modal = new ModalBuilder()
                .setTitle("Анкета в ChillTown")
                .setCustomId("CTform")
    
            const nickInputComponent = new TextInputBuilder()
                .setCustomId("nickField")
                .setLabel("Ваш ник на dreamscape")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Steve")
    
            const ageInputComponent = new TextInputBuilder()
                .setCustomId("ageField")
                .setLabel("Ваш возраст")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("21")
    
            const weekOnlineComponent = new TextInputBuilder()
                .setCustomId("weekOnlineField")
                .setLabel("Сколько часов в неделю вы проводите в игре?")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("15-30")
    
            const didKnowComponent = new TextInputBuilder()
                .setCustomId("didKnowField")
                .setLabel("Как вы узнали о нашем городе?")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("С сайта сервера")
    
            const beDoingComponent = new TextInputBuilder()
                .setCustomId("beDoingField")
                .setLabel("Чем вы будете заниматься в нашем городе?")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Cтроить дома")
    
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
            await interaction.reply({ content: "Канал для отправки формы не найден.", ephemeral: true });
            return;
        }

        const channel = await interaction.guild?.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) {
            await interaction.reply({ content: "Канал для отправки формы не доступен.", ephemeral: true });
            return;
        }

        const fields = interaction.fields;
        const embed = new EmbedBuilder()
            .setTitle("Новая заявка в ChillTown")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() ?? undefined })            
            .setFooter({ text: `ID пользователя: ${interaction.user.id}` })
            .addFields(
                { name: "Ник на dreamscape", value: fields.getTextInputValue("nickField"), inline: true },
                { name: "Возраст", value: fields.getTextInputValue("ageField"), inline: true },
                { name: "Часы в неделю", value: fields.getTextInputValue("weekOnlineField"), inline: true },
                { name: "Как узнали о нас", value: fields.getTextInputValue("didKnowField"), inline: true },
                { name: "Планы в городе", value: fields.getTextInputValue("beDoingField"), inline: true }
            )
            .setColor("#0099ff");
        const acceptButton = new ButtonBuilder()
            .setCustomId(`accept_${interaction.user.id}`)
            .setLabel("Принять")
            .setStyle(ButtonStyle.Success);

        const rejectButton = new ButtonBuilder()
            .setCustomId(`reject_${interaction.user.id}`)
            .setLabel("Отклонить")
            .setStyle(ButtonStyle.Danger);

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(acceptButton, rejectButton);

        await channel.send({ embeds: [embed], components: [actionRow] });

        await interaction.reply({
            content: "Ваша заявка отправлена на рассмотрение.",
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
                await message.edit({ content: `# Игрок ${userId} принят в город.`, components: [] });

                const role = interaction.guild?.roles.cache.find(r => r.id === "1216828560057041076"); // роль вида на жительство
                if (role) {
                    await guildMember?.roles.add(role).catch(console.error);
                }

                embed = new EmbedBuilder()
                    .setTitle("Заявка принята")
                    .setDescription(`На первое время вам выдан вид на жительство. \n Не забудьте принять приглашение в город в [личном кабинете](https://dreamscape.su/pc/) \n\n Так же ознакомьтесь с форумом <#1213190922284568597>`)
                    .setColor("#00FF00");
            } else if (action === 'reject') {
                await message.edit({ content: `# Заявка игрока ${userId} отклонена.`, components: [] });
                
                const role = interaction.guild?.roles.cache.find(r => r.id === "1216830076931543152"); // роль непринятой заявки
                if (role) {
                    await guildMember?.roles.add(role).catch(console.error);
                }

                embed = new EmbedBuilder()
                    .setTitle("Заявка отклонена")
                    .setDescription(`Ваша заявка в ChillTown была отклонена.`)
                    .setColor("#FF0000");
            }

            if (embed) {
                await user.send({ embeds: [embed] }).catch(console.error);
            } else {
                console.error("Попытка отправить неопределенный embed");
            }        
        });
    }
}
