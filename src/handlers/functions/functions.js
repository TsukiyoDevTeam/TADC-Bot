const Discord = require("discord.js");
const cooldownFilePath = "src/JSON/cooldowns.json";
const fs = require("fs").promises;
const path = require("node:path");

module.exports = async (client) => {
	//----------------------------------------------------------------//
	//                         Permissions                            //
	//----------------------------------------------------------------//

	client.loadSubcommands = async (client, interaction, args) => {
		try {
			return require(
				`${process.cwd()}/src/commands/${interaction.commandName}/${interaction.options.getSubcommand()}`,
			)(client, interaction, args).catch((err) => {
				client.emit("errorCreate", err, interaction.commandName, interaction);
			});
		} catch {
			return require(
				`${process.cwd()}/src/commands/${interaction.commandName}/${interaction.options.getSubcommand()}`,
			)(client, interaction, args).catch((err) => {
				client.emit("errorCreate", err, interaction.commandName, interaction);
			});
		}
	};

	client.createLeaderboard = async (title, lb, interaction) => {
		if (!title) {
			const title = "Private Notes View";
			interaction
				.reply({
					embeds: [await client.generateEmbed(0, 0, lb, title, interaction)],
					ephemeral: true,
				})
				.then(async (msg) => {
					if (lb.length <= 10) return;

					const button1 = new Discord.ButtonBuilder()
						.setCustomId("back_button")
						.setEmoji("⬅️")
						.setStyle(Discord.ButtonStyle.Secondary)
						.setDisabled(true);

					const button2 = new Discord.ButtonBuilder()
						.setCustomId("forward_button")
						.setEmoji("➡️")
						.setStyle(Discord.ButtonStyle.Secondary);

					const row = new Discord.ActionRowBuilder().addComponents(
						button1,
						button2,
					);

					msg.edit({
						embeds: [await client.generateEmbed(0, 0, lb, title, interaction)],
						components: [row],
					});

					let currentIndex = 0;
					const collector = interaction.channel.createMessageComponentCollector(
						{ componentType: Discord.ComponentType.Button, time: 60000 },
					);

					collector.on("collect", async (btn) => {
						if (
							btn.user.id === interaction.user.id &&
							btn.message.id === msg.id
						) {
							btn.customId === "back_button"
								? (currentIndex -= 10)
								: (currentIndex += 10);

							const btn1 = new Discord.ButtonBuilder()
								.setCustomId("back_button")
								.setEmoji("⬅️")
								.setStyle(Discord.ButtonStyle.Secondary)
								.setDisabled(true);

							const btn2 = new Discord.ButtonBuilder()
								.setCustomId("forward_button")
								.setEmoji("➡️")
								.setStyle(Discord.ButtonStyle.Secondary)
								.setDisabled(true);

							if (currentIndex !== 0) btn1.setDisabled(false);
							if (currentIndex + 10 < lb.length) btn2.setDisabled(false);

							const row2 = new Discord.ActionRowBuilder().addComponents(
								btn1,
								btn2,
							);

							msg.edit({
								embeds: [
									await client.generateEmbed(
										currentIndex,
										currentIndex,
										lb,
										title,
										interaction,
									),
								],
								components: [row2],
							});
							btn.deferUpdate();
						}
					});

					collector.on("end", async (btn) => {
						const btn1Disable = new Discord.ButtonBuilder()
							.setCustomId("back_button")
							.setEmoji("⬅️")
							.setStyle(Discord.ButtonStyle.Secondary)
							.setDisabled(true);

						const btn2Disable = new Discord.ButtonBuilder()
							.setCustomId("forward_button")
							.setEmoji("➡️")
							.setStyle(Discord.ButtonStyle.Secondary)
							.setDisabled(true);

						const rowDisable = new Discord.ActionRowBuilder().addComponents(
							btn1Disable,
							btn2Disable,
						);

						msg.edit({
							embeds: [
								await client.generateEmbed(
									currentIndex,
									currentIndex,
									lb,
									title,
									interaction,
								),
							],
							components: [rowDisable],
						});
					});
				});
		} else {
			interaction
				.editReply({
					embeds: [await client.generateEmbed(0, 0, lb, title, interaction)],
					fetchReply: true,
				})
				.then(async (msg) => {
					if (lb.length <= 10) return;

					const button1 = new Discord.ButtonBuilder()
						.setCustomId("back_button")
						.setEmoji("⬅️")
						.setStyle(Discord.ButtonStyle.Secondary)
						.setDisabled(true);

					const button2 = new Discord.ButtonBuilder()
						.setCustomId("forward_button")
						.setEmoji("➡️")
						.setStyle(Discord.ButtonStyle.Secondary);

					const row = new Discord.ActionRowBuilder().addComponents(
						button1,
						button2,
					);

					msg.edit({
						embeds: [await client.generateEmbed(0, 0, lb, title, interaction)],
						components: [row],
					});

					let currentIndex = 0;
					const collector = interaction.channel.createMessageComponentCollector(
						{ componentType: Discord.ComponentType.Button, time: 60000 },
					);

					collector.on("collect", async (btn) => {
						if (
							btn.user.id === interaction.user.id &&
							btn.message.id === msg.id
						) {
							btn.customId === "back_button"
								? (currentIndex -= 10)
								: (currentIndex += 10);

							const btn1 = new Discord.ButtonBuilder()
								.setCustomId("back_button")
								.setEmoji("⬅️")
								.setStyle(Discord.ButtonStyle.Secondary)
								.setDisabled(true);

							const btn2 = new Discord.ButtonBuilder()
								.setCustomId("forward_button")
								.setEmoji("➡️")
								.setStyle(Discord.ButtonStyle.Secondary)
								.setDisabled(true);

							if (currentIndex !== 0) btn1.setDisabled(false);
							if (currentIndex + 10 < lb.length) btn2.setDisabled(false);

							const row2 = new Discord.ActionRowBuilder().addComponents(
								btn1,
								btn2,
							);

							msg.edit({
								embeds: [
									await client.generateEmbed(
										currentIndex,
										currentIndex,
										lb,
										title,
										interaction,
									),
								],
								components: [row2],
							});
							btn.deferUpdate();
						}
					});

					collector.on("end", async (btn) => {
						const btn1Disable = new Discord.ButtonBuilder()
							.setCustomId("back_button")
							.setEmoji("⬅️")
							.setStyle(Discord.ButtonStyle.Secondary)
							.setDisabled(true);

						const btn2Disable = new Discord.ButtonBuilder()
							.setCustomId("forward_button")
							.setEmoji("➡️")
							.setStyle(Discord.ButtonStyle.Secondary)
							.setDisabled(true);

						const rowDisable = new Discord.ActionRowBuilder().addComponents(
							btn1Disable,
							btn2Disable,
						);

						msg.edit({
							embeds: [
								await client.generateEmbed(
									currentIndex,
									currentIndex,
									lb,
									title,
									interaction,
								),
							],
							components: [rowDisable],
						});
					});
				});
		}
	};

	//----------------------------------------------------------------//
	//                         Miscellaneous                          //
	//----------------------------------------------------------------//

	client.getInvite = async function getInvite(interaction) {
		const guildInvites = await interaction.guild.invites.fetch();
		let invite;
		const botInvites = guildInvites.filter(
			(inv) => inv.inviter && inv.inviter.id === client.user.id,
		);

		if (botInvites.size > 0) {
			// Check if any of the bot's invites has indefinite max age
			const indefiniteInvite = botInvites.find((inv) => inv.maxAge === 0);

			if (indefiniteInvite) {
				// If there's an invite with indefinite max age, use it
				invite = indefiniteInvite;
			} else {
				// Use the first bot invite if none have indefinite max age
				invite = botInvites.first();
			}
		} else {
			// If the bot does not have an invite in the guild, create a new one for any text channel in the guild
			const textChannel = interaction.guild.channels.cache.find(
				(channel) => channel.type === Discord.ChannelType.GuildText,
			);

			if (textChannel) {
				try {
					const createdInvite = await textChannel.createInvite({
						maxAge: 0,
						maxUses: 0,
					});

					invite = createdInvite;
				} catch (e) {
					console.log(`Error generating invite in ${guild.name}:\n ${e}`);
				}
			} else {
				console.log(`Guild ${guild.name} (${guild.id}) has no text channels.`);
			}
		}
		return invite;
	};

	client.makeInvite = async function makeInvite(guild) {
		let invite;
		try {
			const botInvites = await guild.invites.fetch();
			const botInvite = botInvites.find(
				(invite) =>
					invite.inviter &&
					invite.inviter.id === client.user.id &&
					!invite.expiresAt,
			);
			if (botInvite) {
				invite = botInvite.url;
				return invite;
			}
			const allInvites = await guild.invites.fetch();
			const existingInvite = allInvites.find((invite) => !invite.expiresAt);
			if (existingInvite) {
				invite = existingInvite.url;
				return invite;
			}
			const newInvite = await guild.createInvite({ maxAge: 0 });
			invite = newInvite.url;
			return invite;
		} catch (error) {
			console.error("Error fetching/creating invite:", error);
			invite = "No perms";
			return invite;
		}
	};

	client.checkCooldown = async (interaction, timeOut, key1) => {
		let key;
		let _, __;
		if (key1.includes("|")) {
			[_, __, key] = key1.split("|");
		} else {
			key = key1;
		}

		let xxx;
		if (interaction === null) {
			xxx = "none";
		} else {
			xxx = interaction;
		}

		if (!validateInputs(xxx, timeOut, key)) return false;

		try {
			const rawTime = await fixAndRetryCooldown(xxx, timeOut, key, key1);
			if (rawTime === 0) return false;

			const unixTime = Math.ceil((Date.now() + rawTime * 1000) / 1000);
			if (xxx === "none") {
				const cooldownEmbed = new Discord.EmbedBuilder()
					.setTitle("Slow down!")
					.setDescription(
						`Whoa whoa there buddy, going a bit quick there!\n\n**__Try again:__**\n> <t:${unixTime}:R>\n> <t:${unixTime}:f>`,
					)
					.setColor("#ED4245")
					.setFooter(client.footer());

				return cooldownEmbed; // Return the embed with cooldown details
			}

			const response = {
				error: `Whoa whoa there buddy, going a bit quick there!\n\n**__Try again:__**\n> <t:${unixTime}:R>\n> <t:${unixTime}:f>`,
			};

			const y = await handleInteractionResponse(xxx, response);
			if (y && typeof y === "object" && y instanceof Discord.EmbedBuilder) {
				return y;
			}
			return true;
		} catch (error) {
			console.error("Error in client.checkCooldown:", error);
			return false;
		}
	};

	async function handleInteractionResponse(interaction, response) {
		const errEmbed = new Discord.EmbedBuilder()
			.setTitle("Slow down!")
			.setDescription(`
                    ${response.error}
                    
                    > *If this cooldown doesn't resolve itself within 5s of the timer ending, please contact me via the [support server](https://dreamwxve.dev/discord)*
                    `)
			.setColor("#f6bbcd")
			.setFooter(client.footer);

		try {
			if (interaction === "none") {
				return errEmbed;
			}

			const type = getResponseType(interaction);

			if (type === "ephemeral") {
				await interaction.reply({ embeds: [errEmbed], ephemeral: true });
			} else if (type === "ephemeraledit") {
				await interaction.editReply({ embeds: [errEmbed], ephemeral: true });
			} else if (type === "editreply") {
				await interaction.editReply({ embeds: [errEmbed] });
			} else if (type === "message") {
				await interaction.reply({ embeds: [errEmbed] });
			} else {
				await interaction.channel.send({ embeds: [errEmbed] });
			}
		} catch (error) {
			console.error("Error handling interaction response:", error);
			return 0;
		}
	}

	async function fixAndRetryCooldown(interaction, cooldownTime, key, key1) {
		let attempts = 0;
		while (attempts < 2) {
			try {
				return await manageCooldown(interaction, cooldownTime, key, key1);
			} catch (error) {
				console.error("Error in manageCooldown, retrying:", error);
				await initializeUserCooldowns(interaction, key, key1);
				attempts++;
			}
		}
		throw new Error("Failed to manage cooldown after retrying.");
	}

	async function manageCooldown(interaction, cooldownTime, keyraw, key1) {
		let user;
		let guild;
		let key;
		if (interaction !== "none") {
			user = interaction.user;
			guild = interaction.guild;
			key = keyraw;
		} else {
			[user, guild, key] = key1.split("|");
		}

		if (!user || !guild) throw new Error("Invalid objects in manage cooldown");

		let userId;
		let guildId;
		if (interaction !== "none") {
			userId = user.id;
			guildId = guild.id;
		} else {
			userId = user;
			guildId = guild;
		}

		const currentTime = Date.now();

		const cooldowns = await getCooldowns();

		if (!cooldowns[guildId]) cooldowns[guildId] = {};
		if (!cooldowns[guildId][userId]) cooldowns[guildId][userId] = {};

		const userCooldown = cooldowns[guildId][userId][key];
		if (userCooldown) {
			const remainingCooldown = userCooldown - currentTime;
			if (remainingCooldown > 0) return Math.ceil(remainingCooldown / 1000);
		}

		cooldowns[guildId][userId][key] = currentTime + cooldownTime * 1000;
		await saveCooldowns(cooldowns);
		return 0;
	}

	async function getCooldowns() {
		try {
			const rawData = await fs.readFile(cooldownFilePath, "utf-8");
			return JSON.parse(rawData) || {};
		} catch (error) {
			if (error.code === "ENOENT" || error.name === "SyntaxError") {
				return {}; // Return empty object if file not found or empty
			}
			throw error;
		}
	}

	async function saveCooldowns(newCooldowns) {
		try {
			const existingCooldowns = await getCooldowns();

			// Merge new cooldowns into existing cooldowns
			for (const guildId in newCooldowns) {
				if (!existingCooldowns[guildId]) {
					existingCooldowns[guildId] = {};
				}
				for (const userId in newCooldowns[guildId]) {
					if (!existingCooldowns[guildId][userId]) {
						existingCooldowns[guildId][userId] = {};
					}
					for (const key in newCooldowns[guildId][userId]) {
						existingCooldowns[guildId][userId][key] =
							newCooldowns[guildId][userId][key];
					}
				}
			}

			const dataToWrite = JSON.stringify(existingCooldowns, null, 4);
			await fs.writeFile(cooldownFilePath, dataToWrite, "utf-8");
		} catch (error) {
			console.error("Error writing cooldowns to file:", error);
			throw error;
		}
	}

	async function initializeUserCooldowns(interaction, keyraw, key1) {
		let user;
		let guild;
		let key;
		if (interaction !== "none") {
			user = interaction.user;
			guild = interaction.guild;
			key = keyraw;
		} else {
			[user, guild, key] = key1.split("|");
		}

		if (!user || !guild)
			throw new Error("init user cooldown: user or guild is invalid/undefined");

		let userId;
		let guildId;
		if (interaction !== "none") {
			userId = user.id;
			guildId = guild.id;
		} else {
			userId = user;
			guildId = guild;
		}

		const cooldowns = await getCooldowns();

		if (!cooldowns[guildId]) cooldowns[guildId] = {};
		if (!cooldowns[guildId][userId]) cooldowns[guildId][userId] = {};

		if (!cooldowns[guildId][userId][key]) {
			cooldowns[guildId][userId][key] = null;
			await saveCooldowns(cooldowns);
		}
	}

	function validateInputs(interaction, timeOut, key) {
		if (
			interaction !== undefined &&
			interaction !== null &&
			!Number.isNaN(timeOut) &&
			key
		) {
			return true;
		}
		console.log("Invalid parameters in client.checkCooldown - inputs invalid");
		return false;
	}

	function getResponseType(interaction) {
		if (!interaction) return false;
		if (!interaction.user) return "message";

		if (interaction.deferred) {
			if (!interaction.replied && interaction.ephemeral === null) {
				return "ephemeral";
			}
			if (interaction.replied && interaction.ephemeral === null) {
				return "editReply";
			}
			if (!interaction.replied && interaction.ephemeral === false) {
				return "editReply";
			}
			if (interaction.replied && interaction.ephemeral === false) {
				return "editReply";
			}
			if (!interaction.replied && interaction.ephemeral === true) {
				return "ephemeral";
			}
			if (interaction.replied && interaction.ephemeral === true) {
				return "editReply";
			}
			return "editReply"; // Default to edit reply if unsure
		}
		if (!interaction.replied && interaction.ephemeral === null) {
			return "ephemeral";
		}
		if (interaction.replied && interaction.ephemeral === null) {
			return "editReply";
		}
		if (!interaction.replied && interaction.ephemeral === false) {
			return "ephemeral";
		}
		if (interaction.replied && interaction.ephemeral === false) {
			return "editReply";
		}
		if (!interaction.replied && interaction.ephemeral === true) {
			return "ephemeral";
		}
		if (interaction.replied && interaction.ephemeral === true) {
			return "ephemeraledit";
		}
		return "editReply"; // Default to edit reply if unsure
	}
	// =========================================================================

	client.formatTime = function formatTime(time) {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = (time % 60).toFixed(1); // keep one decimal place for seconds

		let formattedTime = "";
		if (hours > 0) {
			formattedTime += `${hours} hours`;
		}
		if (minutes > 0) {
			formattedTime += `${(formattedTime ? ", " : "") + minutes} minutes`;
		}
		if (seconds > 0) {
			formattedTime += `${(formattedTime ? " and " : "") + seconds} seconds`;
		}

		return formattedTime;
	};

	client.toUnix = function isoToUnix(isoDateString) {
		const unixTimestamp = Date.parse(isoDateString);
		return unixTimestamp / 1000;
	};

	client.url2Media = async function url2Image(imageUrl) {
		if (!imageUrl) return false;
		try {
			const response = await fetch(imageUrl);

			if (!response.ok) {
				console.error(
					`Failed to fetch image from ${imageUrl}. Status: ${response.status} ${response.statusText}`,
				);
				return false;
			}

			const contentType = response.headers.get("content-type"); // Get the content-type header
			const fileExtension = getFileExtensionFromContentType(contentType); // Extract file extension

			if (!fileExtension) {
				console.error(`Unable to determine file extension for "${mediaUrl}"`);
				return false;
			}
			const imageBuffer = await response.buffer();
			const attachment = new Discord.AttachmentBuilder(imageBuffer, {
				name: `file.${fileExtension}`,
			});
			return attachment;
		} catch (error) {
			console.error("Error fetching attachment:", error);
			return false;
		}

		function getFileExtensionFromContentType(contentType) {
			switch (contentType) {
				// Images
				case "image/jpeg":
					return "jpg";
				case "image/png":
					return "png";
				case "image/gif":
					return "gif";
				case "image/bmp":
					return "bmp";
				case "image/webp":
					return "webp";
				case "image/tiff":
					return "tiff";
				case "image/svg+xml":
					return "svg";

				// Videos
				case "video/mp4":
					return "mp4";
				case "video/quicktime":
					return "mov";
				case "video/x-msvideo":
					return "avi";
				case "video/x-matroska":
					return "mkv";
				case "video/webm":
					return "webm";

				// Add more cases for other supported image and video types if needed

				default:
					// Handle other content types if needed
					return null;
			}
		}
	};

	client.delay = function delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	};

	client.percentageBar = (curr, full, type) => {
		if (full <= 0) return "Error: Full value must be greater than 0.";
		if (curr < 0)
			return "Error: Current value must be greater than or equal to 0.";
		if (curr > full)
			return "Error: Current value must be less than or equal to full value.";

		const percent = (curr / full) * 100;
		const numCompleteBars = Math.floor(percent / (100 / 25));
		const numEmptyBars = 25 - numCompleteBars;
		const completeBar = "".repeat(numCompleteBars);
		const emptyBar = "⬛".repeat(numEmptyBars);

		const bar = `${completeBar}${emptyBar}`;
		const percentage = `${percent.toFixed(2)}%`;

		switch (type) {
			case "bar":
				return bar;
			case "percent":
				return percentage;
			default:
				return `${bar}\n${percentage}`;
		}
	};

	const version = require("../../../package.json").version;
	client.footer = (msg) => {
		if (msg) {
			return {
				text: `${msg}\n© 2024 Dreamwxve | v${version}`,
				iconURL:'https://raw.githubusercontent.com/Dreamwxve/Dreamwxve/refs/heads/main/watermarked-d-circle.png'
			}
		}
		return {
			text: `© 2024 Dreamwxve | v${version}`,
			iconURL:'https://raw.githubusercontent.com/Dreamwxve/Dreamwxve/refs/heads/main/watermarked-d-circle.png'
		}
	};

	client.advTime = async (ms, format = "readable") => {
		const now = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
		const futureTimestamp = Math.floor((Date.now() + ms) / 1000); // Future Unix timestamp in seconds

		const hours = Math.floor(ms / (1000 * 60 * 60));
		const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((ms % (1000 * 60)) / 1000);

		const formatOptions = {
			readable: () => {
				const parts = [];
				if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
				if (minutes > 0)
					parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
				if (seconds > 0 || parts.length === 0)
					parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
				return parts.join(", ");
			},
			"MM:SS": () => {
				const paddedMinutes = String(minutes).padStart(2, "0");
				const paddedSeconds = String(seconds).padStart(2, "0");
				return `${paddedMinutes}:${paddedSeconds}`;
			},
			"HH:MM:SS": () => {
				const paddedHours = String(hours).padStart(2, "0");
				const paddedMinutes = String(minutes).padStart(2, "0");
				const paddedSeconds = String(seconds).padStart(2, "0");
				return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
			},
			"discord-relative": () => {
				return `<t:${futureTimestamp}:R>`; // Discord's relative time format
			},
			"discord-date": () => {
				return `<t:${futureTimestamp}:D>`; // Discord's date format
			},
			"discord-time": () => {
				return `<t:${futureTimestamp}:T>`; // Discord's time format
			},
		};

		if (formatOptions[format]) {
			return formatOptions[format]();
		}
		throw new Error("Unsupported format");
	};

	//====================================================================
};
