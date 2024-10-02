const Discord = require("discord.js");

module.exports = async (client, interaction) => {

	const cmd = client.commands.get(interaction.commandName);
	if (cmd) {
		cmd
			.run(client, interaction, interaction.options._hoistedOptions)
			.catch((err) => {
				client.emit("errorCreate", err, interaction.commandName, interaction);
			});
	}

};
