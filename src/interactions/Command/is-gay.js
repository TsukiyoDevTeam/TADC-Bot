const Discord = require("discord.js");

module.exports = {
	data: new Discord.SlashCommandBuilder()
    .setName("is-gay")
    .setDescription("check to see if they are gay or not")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("user")
            .setRequired(true)
    )
	,

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.CommandInteraction} interaction
	 * @param {String[]} args
	 */

	run: async (client, interaction, args) => {
		const user = interaction.options.getUser("user");
		const x = Math.floor(Math.random() * 3) + 1;

		const isGay = x === 1 ? false : true;
		if (isGay) {
        	interaction.reply(`${user} is gay`)
		} else {
			interaction.reply(`${user} is not gay`)
		}
		/**
		 * If you have these commands in the folder
		 *
		 * client.loadSubcommands(client, interaction, args);
		 */
	},
};
