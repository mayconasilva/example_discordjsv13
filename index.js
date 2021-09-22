const { Client, Intents, Guild, Message, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const fs = require('fs');

const client = new Client({ intents: 32767 });
const config = require("./config.json");

//Registro de comandos por slash

const comma = []
client.commands = new Collection();
const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./comandos/${file}`);
	client.commands.set(command.data.name, command);
  comma.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.token);
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
      Routes.applicationCommands(config.clientId), //Aqui registra os comandos globalmente, para registrar apenas no servidor consulte o link a seguir: https://discordjs.guide/interactions/registering-slash-commands.html
      { body: comma },
    );

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();


//padrão
client.once("ready", () => {
    console.log(`O bot foi iniciado com ${client.users.cache.size} usuários em ${client.guilds.cache.size} servidores.`)

  
})

//comandos por prefixo
client.on("messageCreate", async message => {
    if(message.author.bot) return; //ignorar mensagem de bots
    if(message.channel.type === "dm") return; //ignorar mensagem de dm
    if(!message.content.startsWith(config.prefix)) return; //ignorar mensagem que não sejam iniciadas pelo prefixo 'p!'
    const args = message.content
    .trim().slice(config.prefix.length)
    .split(/ +/g);
    const comando = args.shift().toLowerCase()
    try {
      const comandoFile = require(`./comando/${comando}.js`)
      comandoFile.run(client, message, args);

    } catch (err) {console.error("Erro" + err)
  message.channel.send("Ops, Não tenho esse comando. Tem certeza que era isso que você queria? \n **Atenção, alguns comandos foram removidos para serem modificados ou não estarão no bot novamente devido a bugs.**")} //comadno handler
})

//Responder comandos por slash
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
  //pode tirarm, só para verificação
  console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
client.login(config.token)
