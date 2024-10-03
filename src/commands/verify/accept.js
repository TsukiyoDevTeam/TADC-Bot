const Discord = require("discord.js")
const model = require("../../database/userVerify.js")

module.exports = async (client, interaction) => {
    const user = interaction.options.getUser("user");
    const isVerified = await client.isVerified(user.id);
    const guild = await client.guilds.fetch(interaction.guild.id);
    const isValidUser = guild.members.cache.get(user.id) ? true : false;

    if (!isValidUser) {
        return interaction.reply({
            embeds: [
                client.errorEmbed("Please give me someone that is in the server")
            ]
        });
    }

    switch(isVerified) {
        case 0:
            return interaction.reply({
                embeds: [
                    client.errorEmbed(`> An error occured when fetching data for ${user}`)
                ],
                ephemeral: true
            });

        case 1:
            return interaction.reply({
                embeds: [
                    client.errorEmbed(`> No data was found for this ${user}. This means that they have not completed the ID verification yet.`)
                ],
                ephemeral: true
            });

        case 2:
            return interaction.reply({
                embeds: [
                    client.errorEmbed(`> ${user} has already been verified.`)
                ],
                ephemeral: true
            });

        case 3:
            const data = await model.findOne({User: user.id});
            data.Verified = true;
            await data.save();
            const x = await client.verifyUser(user, interaction.guild);
            if (x && !x.ok) {
                return interaction.reply({
                    embeds: [
                        client.errorEmbed(`> Something went wrong when adding the role\n> **Error:** ${x.e.message}`)
                    ],
                    ephemeral: true
                });
            }
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle("ID Verification")
                        .setColor("#7DDA58")
                        .setDescription(`> ${user} has now been successfully verified!`)
                        .setThumbnail("https://cdn3.emoji.gg/emojis/7567-w98-approve.png")
                        .setTimestamp()
                ]
            });

        default:
            return interaction.reply({
                embeds: [
                    client.errorEmbed("> Something unknown happened")
                ],
                ephemeral: true
            })
    }   
}