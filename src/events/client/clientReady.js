const cron = require("node-cron");
const Discord = require("discord.js");

module.exports = (client) => {	
		const statuttext = [
			"watching the server",
			"reading my nughty list",
			"getting food",
			"i dont like riddles"
		  ];
		  
		  function getRandomIndex(arrayLength) {
			return Math.floor(
			  (Math.random() * (Math.random() * 1000000)) % arrayLength
			);
		  }
		  
		  // Schedule the task to run every minute
		  cron.schedule('* * * * *', () => {
			const randomIndex = getRandomIndex(statuttext.length);
			const randomText = statuttext[randomIndex];
		  
			client.user.setPresence({
			  activities: [{ name: randomText, type: Discord.ActivityType.Custom }],
			  status: "dnd",
			});
		  });
		
		  console.log(`${"|  @TADC-Bot/bot".magenta + " >>> ".grey}All systems go!`);
};
