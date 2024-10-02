const Discord = require("discord.js");

module.exports = {
	data: new Discord.SlashCommandBuilder()
        .setName("verify")
        .setDescription("manually verify a member"),

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.CommandInteraction} interaction
	 * @param {String[]} args
	 */

	run: async (client, interaction, args) => {
		 client.loadSubcommands(client, interaction, args);
	},
};
