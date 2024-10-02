require("colors")

module.exports = async (client, message) => {
    if (process.env.use_debug && process.env.use_debug === "yes") {
        console.log("|  @TADC-Bot/debug".magenta + " >>> ".grey + String(message).italic)
    }
}