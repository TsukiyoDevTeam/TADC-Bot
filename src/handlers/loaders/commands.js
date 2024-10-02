const { REST, Routes } = require("discord.js");
const fs = require("fs");
const Discord = require("discord.js")
require("colors"); // console colouring

module.exports = async (client) => {
	client.commands = new Discord.Collection();
	const commands = [];
	const interactionDirs = fs.readdirSync("./src/interactions");
	let cmdCount = 0;

	for (const dirs of interactionDirs) {
		const commandFiles = await fs.promises.readdir(
			`./src/interactions/${dirs}`,
		);
		cmdCount = cmdCount + commandFiles.length;

		for (const file of commandFiles) {
			if (file.startsWith("_")) continue;
			const command = require(
				`${process.cwd()}/src/interactions/${dirs}/${file}`,
			);
			client.commands.set(command.data.name, command);
			commands.push(command.data);
		}
	}

	const rest = new REST({
		version: "10",
	}).setToken(process.env.TOKEN);

	try {
		await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
			body: commands,
		});

		console.log(
			"|  @TADC-Bot/cmdLoader".magenta +
				" >>> ".grey +
				`Loaded ${cmdCount} commands`,
		);
	} catch (error) {
		console.error("Error refreshing application commands:", error);
	}
};
