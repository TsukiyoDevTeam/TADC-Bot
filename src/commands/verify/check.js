const Discord = require("discord.js")
const model = require("../../database/userVerify.js")

module.exports = async (client, interaction) => {
    const user = interaction.options.getUser("user")
    const data = await model.findOne(
        {
            User: user.id
        }
    )

    if (!data) {
        return interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle("No data found")
                    .setDescription("No data was found for that user")
                    .setColor("#F04849")
                    .setFooter(client.footer())
            ]
        })
    }

    const u = await client.users.fetch(user.id);
    const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name: u.username,
            iconURL: u.displayAvatarURL()
        })
        .setTitle("Data for ", u.username)
        .addFields(
            {
                name: "__Time__",
                value: `> <t:${(Math.floor(data.Time / 1000))}:R>`,
                inline: true
            },
            {
                name: "__Verified?__",
                value: `> ${data.Verified ? `\`✅\`` : `\`❌\``}`,
                inline: true
            },
            {
                name: "__IP Address__",
                value: `> || \`${data.IPAddress}\` ||`,
                inline: false
            },
            {
                name: "__Email__",
                value: `> || \`${data.Email}\` ||`,
                inline: true
            }
        )
        .setFooter(client.footer());

        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
}