const Discord = require("discord.js");

module.exports = {
	data: new Discord.SlashCommandBuilder()
        .setName("mod-notes")
        .setDescription("🔒")
		
		.addSubcommand((x) =>
			x
				.setName("add")
				.setDescription("Add a moderator note to a user")
				.addUserOption((x) =>
					x
						.setName("user")
						.setDescription("target")
						.setRequired(true),
				),
		)
        .addSubcommand((x) =>
			x
				.setName("del")
				.setDescription("Delete a moderator note from a user")
				.addUserOption((x) =>
					x
						.setName("user")
						.setDescription("target")
						.setRequired(true),
				),
		)
        .addSubcommand((x) =>
			x
				.setName("view")
				.setDescription("View moderator notes for a user")
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
        return interaction.reply("Soon")
		 //client.loadSubcommands(client, interaction, args);
	},
};
