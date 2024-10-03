const model = require("../../database/userVerify.js");
const Discord = require("dicord.js");

module.exports = async (client, interaction) => {
    const user = interaction.options.getUser("user");
    const data = await model.findOne({ User: user.id });
    let embed;
        if (!data || !data.Note || data.Note == []) {

        }   

if (data.Note) {
    const fields = [];
    for (note of data.Note) {
        const m = data.Note.Message;
        const t = data.Note.Time;
        const x = data.Note.User;
        const u = interaction.guild.members.cache.get(x);

        const field =
        {
            name: `from: ${u.username}`,
            value: `> ${m}\n- <t:${t}:R>`,
            inline:false
        }
        fields.push(field)
    }

    embed = new Discord.EmbedBuilder()
        .setAuthor({
            name: "Moderator Notes",
            iconURL: user.displayAvatarURL({dynamic: true})
        })
        .addFields(fields)
        .setFooter(client.footer())
        .setColor("DarkButNotBlack")
    }
    
    interaction.reply({
        embeds: [embed]
    })

}