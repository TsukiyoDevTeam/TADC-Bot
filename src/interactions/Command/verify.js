const Discord = require("discord.js");

module.exports = {
	data: new Discord.SlashCommandBuilder()
        .setName("verify")
        .setDescription("🔒")
		
		.addSubcommand((x) =>
			x
				.setName("check")
				.setDescription("See user verification status and data")
				.addUserOption((x) =>
					x
						.setName("user")
						.setDescription("target")
						.setRequired(true),
				),
		)
	,

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.CommandInteraction} interaction
	 * @param {String[]} args
	 */

	run: async (client, interaction, args) => {
		 client.loadSubcommands(client, interaction, args);
	},
};
