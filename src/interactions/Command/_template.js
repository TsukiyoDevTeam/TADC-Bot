const Discord = require("discord.js");

module.exports = {
	data: new Discord.SlashCommandBuilder().setName("").setDescription(""),

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.CommandInteraction} interaction
	 * @param {String[]} args
	 */

	run: async (client, interaction, args) => {
		/**
		 * If you have these commands in the folder
		 *
		 * client.loadSubcommands(client, interaction, args);
		 */
	},
};
