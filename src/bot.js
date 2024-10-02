const Discord = require("discord.js");
const fs = require('fs');
const { parse } = require('url');
const path = require('path')
require("colors");
const mongoose = require('mongoose')
require('dotenv').config();
let client;

const clientraw = new Discord.Client({
	partials: [
		Discord.Partials.Channel,
		Discord.Partials.GuildMember,
		Discord.Partials.Message,
		Discord.Partials.Reaction,
		Discord.Partials.User
	],
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMembers,         
		Discord.GatewayIntentBits.GuildModeration,            
		Discord.GatewayIntentBits.GuildEmojisAndStickers,  
		Discord.GatewayIntentBits.GuildWebhooks,          
		Discord.GatewayIntentBits.GuildInvites,            
		Discord.GatewayIntentBits.GuildVoiceStates,        
		Discord.GatewayIntentBits.GuildMessages,            
		Discord.GatewayIntentBits.GuildMessageReactions,   
	  ]
});

/*----------------------------------------------------*/
/*---------------------FUNCTIONS----------------------*/
/*----------------------------------------------------*/
async function checkforproxyandtracer() {
	if (process.env.use_proxy === "yes") {
		function wait4proxy(proxy, timeout = 5000) {
			return new Promise((resolve, reject) => {
				if (proxy.ready) {
					return resolve();
				}

				const timeoutId = setTimeout(() => {
					reject(new Error("Proxy was not ready within the specified timeout of " + timeout + "ms"));
				}, timeout);

				proxy.on("ready", () => {
					clearTimeout(timeoutId);
					resolve();
				});
			});
		}

		const clientProxy = new Proxy(clientraw, {
			get(target, prop, receiver) {
				const original = Reflect.get(target, prop, receiver);

				// Handle getters
				if (typeof original === "function") {
					return function (...args) {
						console.log(`Calling ${prop} with args:`, args);
						try {
							return original.apply(this, args);
						} catch (error) {
							console.error(`Error in ${prop}:`, error);
							throw error;
						}
					};
				}
				
				// Log getters/setters or property accesses
				if (typeof original !== "function" && typeof prop !== "symbol") {
					console.log(`Accessing property ${prop}:`, original);
				}
				return original;
			},
		});

		if (clientProxy.listenerCount("error") === 0) {
			clientProxy.on("error", (e) => {
				if (e instanceof Error) {
					console.error("Error message:", e.message);
					console.error("Error stack trace:", e.stack);
				} else {
					console.error("Non-error object received:", e);
				}
			});
		}

		try {
			await wait4proxy(clientProxy);
		} catch (error) {
			console.error("Proxy error:", error);
			return;
		}
		client = clientProxy;

	} else {
		client = clientraw;
	}
	
	if (process.env.use_tracer === "yes") {
		const path = require("node:path");
		const originalConsoleLog = console.log;
		const originalConsoleError = console.error;

		function getFilePathAndLineNumber(stack) {
			const stackLines = stack.split("\n");
			for (let i = 1; i < stackLines.length; i++) {
				const line = stackLines[i].trim();
				const filePathMatch = line.match(/at\s+.*\((.*):(\d+):(\d+)\)/);
				if (filePathMatch) {
					const filePath = filePathMatch[1];
					const lineNumber = filePathMatch[2];
					const columnNumber = filePathMatch[3];
					return { filePath, lineNumber, columnNumber };
				}
			}
			return null;
		}

		function logWithFileInfo(args, logMethod) {
			const error = new Error();
			const stack = error.stack;
			const stackLines = stack.split("\n").slice(2).join("\n"); // Skip the first two lines
			const location = getFilePathAndLineNumber(stackLines);
			const formattedArgs = args.map(arg => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)));

			if (location) {
				const { filePath, lineNumber, columnNumber } = location;
				logMethod(
					`Logged from: ${path.relative(process.cwd(), filePath)}:${lineNumber}:${columnNumber}\nArguments: ${formattedArgs.join(", ")}`,
				);
			} else {
				logMethod(
					`Could not determine file path and line number. Stack:\n${stack}\nArguments: ${formattedArgs.join(", ")}`,
				);
			}
		}

		console.log = (...args) => {
			logWithFileInfo(args, originalConsoleLog);
		};
		console.error = (...args) => {
			logWithFileInfo(args, originalConsoleError);
		};

		return true;
	}
	return true;
}


start();





async function dbConnect() {
	
	try {
		await mongoose.connect(process.env.DB_URL);
		console.log(`${"|  @TADC-Bot/database".magenta + " >>> ".grey}Connected to database`);
	} catch (err) {
		console.error("|  @TADC-Bot/database".red + " >>> ".grey + "Failed to connect to database".red);
		console.error(err);
		process.exit(1);
	}

	mongoose.connection.on('connected', () => {
		console.log("|  @TADC-Bot/database".magenta + " >>> ".grey + "Database connected!");
		return true;
	});

	mongoose.connection.on('error', (err) => {
		console.error("|  @TADC-Bot/database".red + " >>> ".grey + "Failed to connect to database");
		process.exit(1)
	});

	return true;
}

async function loader() {
	const handlerDirs = fs.readdirSync("./src/handlers");
	for (const dir of handlerDirs) {
		if (dir === "endpoints") continue;
		const handlers = fs.readdirSync(`./src/handlers/${dir}`);
		for (const handler of handlers) {
			if (handler.startsWith("_")) continue;
			try {
				require(`./handlers/${dir}/${handler}`)(client);
			} catch (e) {
				console.log("|  @TADC-Bot/loader".red + " >>> ".grey + `Failed to load ${handler}: ${e.message}`)
			}
		}
	}
	return true;
}

async function connectBot() {
	try {
		await client.login(process.env.TOKEN);
		return true;
	} catch (e) {
		console.log(`${"|  @TADC-Bot/bot".red + " >>> ".grey}Error logging into Nyxia: ${e.message}`);
		return false;
	}
}

async function start() {
	const functions = [
		{ fn: checkforproxyandtracer, args: [clientraw] },
		{ fn: dbConnect, args: [], errorMessage: 'Failed to connect to the database.' },
		{ fn: loader, args: [client], errorMessage: 'Failed to initialize loader.' },
		{ fn: connectBot, args: [client], errorMessage: 'Failed to connect bot.' }
	];

	for (const { fn, args, errorMessage } of functions) {
		const result = await fn(...args);
		if (!result) {
			if (fn !== checkforproxyandtracer) {
				console.error(errorMessage);
				process.exit(1);
			} else {
				continue;
			}
			
		}
	}
}