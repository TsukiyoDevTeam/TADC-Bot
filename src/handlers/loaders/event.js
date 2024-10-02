const fs = require("fs").promises;
const path = require("node:path");
const { Events } = require("discord.js");

module.exports = async (client) => {
	let eventCount = 0;

	// Helper function to load events
	const loadEventsFromDirectory = async (directory, bindToPlayer = false) => {
		const files = await fs.readdir(directory);
		const events = files.filter(
			(file) => file.endsWith(".js") && !file.startsWith("_"),
		);
		eventCount += events.length;

		for (const file of events) {
			try {
				const eventPath = path.resolve(directory, file);
				const event = require(eventPath);
				const eventName = file.split(".")[0];
				const eventUpperCase =
					eventName.charAt(0).toUpperCase() + eventName.slice(1);
				const eventToBind = Events[eventUpperCase]
					? Events[eventUpperCase]
					: eventName;

				// Bind to client or player
				if (bindToPlayer) {
					client.player
						.on(eventToBind, event.bind(null, client))
						.setMaxListeners(0);
				} else {
					if (eventToBind === "error") {
						if (client.listenerCount("error") === 1) {
							continue;
						}
					}
					client.on(eventToBind, event.bind(null, client)).setMaxListeners(0);
				}
			} catch (err) {
				console.error(`Failed to load event ${file}:`, err);
				process.exit(1)
			}
		}
	};

	try {
		const dirs = await fs.readdir("./src/events");
		const eventsPromises = dirs.map(async (dir) => {
			if (dir === "process") {
				return; // skip it
		    } else if (dir === "music") {
				await loadEventsFromDirectory("./src/events/music", true); 
			} else {
				await loadEventsFromDirectory(path.join("./src/events", dir));
			}
		});

		await Promise.all(eventsPromises);

		console.log(
			"|  @TADC-Bot/eventLoader".magenta +
				" >>> ".grey +
				`Loaded ${eventCount} events`,
		);
	} catch (err) {
		console.error("Error loading events:", err);
	}
};
