// 24/7 hour script
const http = require('http');
const express = require('express');
const session = require('express-session')
const app = express();
const cmd = require('node-cmd');
const passwordProtected = require('express-password-protect')
/*global Set, Map*/
app.use(express.static('public'));
const passwordconfig = {
    username: "admin",
    password: process.env.PASSWORD,
    maxAge: 60000 // 1 minute
}

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendFile(__dirname + '/index.html');
});

app.use(passwordProtected(passwordconfig))
app.get('/git', (req, res) => {
  cmd.run("sh git.sh")
  res.sendStatus(200)
})

app.listen(process.env.PORT);


const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const animals = require('random-animals-api');
const got = require("got")
const newUsers = new Discord.Collection();
const prefix = config.prefix

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setPresence({ game: { name: 'beautiful people', type: "WATCHING" }, status: 'online' })
  // List servers the bot is connected to
    console.log("Servers:")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)
    })
});



client.on("message", async message => {
  console.log(message.author.tag + " sent this: (" + message.content + ") in " + message.guild + "'s channel #" + message.channel.name + "(" + message.channel.id + ")");
  if (message.author.bot) return;

  if(message.guild === null){
    client.channels.get("572458414878228486").send(message.author.tag + " said this in a DM to me: \n```\n" + message.content + "\n```");
    console.log(message.author.tag + " said this in a DM to me: \n```\n" + message.content + "\n```");
  };
    
  


  if (message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  if(command === "help") {
    const embed = new Discord.RichEmbed()
    .setTitle("My Commands")
    .setAuthor(client.user.username, client.user.avatarURL)
    .setDescription("Here is the list of my commands!")
    .setColor(0x00AE86)
    .addField(config.prefix + "ping", "See the bot's latency", true)
    .addField(config.prefix + "animals", "See what animals you can get pictures of", true)
    .addField(config.prefix + "meme", "Get yourself a good meme", true)
    .addField(config.prefix + "rps", "Play rock, paper, scissors against the bot! Enter in rock, paper, or scissors as the first argument. (Not case sensitive)", true)
    .addField(config.prefix + "purge", "Delete messages with the first argument as the number of messages to delete", true)
    .setFooter("More Commands coming soon! Contribute at https://github.com/cute-global-cats/kittybot")
    message.channel.send({embed});
  }

  if(command === "purge"){
    if(!message.member.roles.some(r=>["Support", "Moderator", "Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR"))
      return
    let amountToPurge = parseInt(args[0])
    if (isNaN(amountToPurge)) { message.channel.send(`${args[0]} is not a number! Try again.`); return }
    message.delete().catch(O_o=>{});
    message.channel.bulkDelete(amountToPurge)
      .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
      .catch(console.error);
  }

  if(command === "say") {
    if(config.eval.some(user => user === message.author.id) === true) {
      message.delete().catch(O_o=>{});
      message.channel.startTyping();
      const sayMessage = args.join(" ");
      message.delete().catch(O_o=>{});
      message.channel.send(sayMessage);
      message.channel.stopTyping();
    }
  }

  if(command === "rittoo") {
    if(config.eval.some(user => user === message.author.id) === true) {
      message.delete().catch(O_o=>{});
      message.channel.startTyping();
      const sayMessage = "<@408249494883532801> ".repeat(parseInt(args[0]));
      message.delete().catch(O_o=>{});
      message.channel.send(sayMessage);
      message.channel.stopTyping();
    }

  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    message.delete().catch(O_o=>{});
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! :ping_pong: Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "cat"){
    animals.cat().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }

  if(command === "dog"){
    animals.dog().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }

  /*
  if (command === "unbpurge") {
    if(!message.member.roles.some(r=>["Support", "Moderator", "Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR"))
      return
    message.channel.fetchMessages({ limit: 100 })
      .then(fetchedMessages => {
        const messagesToDelete = fetchedMessages.filter(msg => !(msg.content.includes(':epic_e::epic_p::epic_i::epic_c:')));
        return message.channel.bulkDelete(messagesToDelete, true);
      })
      //.then(deletedMessages => channel.send(`Deleted **${deletedMessages.size}** message${deletedMessages.size !== 1 ? 's' : ''}.`))
      .catch(console.error);
  }

  if (command === "cfpurge") {
    if(!message.member.roles.some(r=>["Support", "Moderator", "Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR"))
      return
    message.channel.fetchMessages({ limit: 100 })
      .then(fetchedMessages => {
        const messagesToDelete = fetchedMessages.filter(msg => !(msg.content.includes('Congratulations! You **WON**')));
        message.channel.bulkDelete(messagesToDelete, true);
      })
      //.then(deletedMessages => channel.send(`Deleted **${deletedMessages.size}** message${deletedMessages.size !== 1 ? 's' : ''}.`))
      .catch(console.error);
  }
*/
  if (command === "rps") {
    let content = message.content.toLowerCase();
    let guess = Math.floor(Math.random() * 3);
    let rock_text = ['Paper! I win!', 'Scissors! You win!', 'Rock! We tie!'];
    let paper_text = ['Rock! You win!', 'Scissors! I win!', 'Paper! We tie!'];
    let scissors_text = ['Rock! I win', 'Paper! You win!', 'Scissors! We tie!'];
    let interface = [];

    let rock = new Discord.RichEmbed()
      .setAuthor('Rock, Paper, Scissors')
      .setColor(0x6B5858)
      .addField('You choose', `${args[0]}`)
      .addField('I choose', rock_text[guess])
      .setTimestamp();

    let paper = new Discord.RichEmbed()
      .setAuthor('Rock, Paper, Scissors')
      .setColor(0x6B5858)
      .addField('You choose', `${args[0]}`)
      .addField('I choose', paper_text[guess])
      .setTimestamp();

    let scissors = new Discord.RichEmbed()
      .setAuthor('Rock, Paper, Scissors')
      .setColor(0x6B5858)
      .addField('You choose', `${args[0]}`)
      .addField('I choose', scissors_text[guess])
      .setTimestamp();

    interface[prefix + 'rps rock'] = rock;
    interface[prefix + 'rps paper'] = paper;
    interface[prefix + 'rps scissors'] = scissors;

    if (content in interface) { 
      message.channel.send(interface[content]); 
    } else {
      message.channel.send(`Please pick either Rock, Paper, or Scissors.`);
    }

  }

  if(command === "bird"){
    animals.bird().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "fox"){
    animals.fox().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "bunny"){
    animals.bunny().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "lizard"){
    animals.lizard().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "owl"){
    animals.owl().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "tiger"){
    animals.tiger().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "shiba"){
    animals.shiba().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "lion"){
    animals.lion().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "duck"){
    animals.duck().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "panda"){
    animals.panda().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "penguin"){
    animals.penguin().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }

  if(command === "animals"){
    message.channel.send("This bot contains pictures for these animals:\n```\ncat, fox, bird, dog, bunny, lizard, owl, tiger, shiba, lion, duck, panda, and penguin\n```")
  }

  if(command === "verify"){
    if(message.member.roles.some(r=>["Support", "Moderator", "Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR")){
    let verified = message.guild.roles.find(role => role.name === "Verified");
    let person = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!person)
      return message.reply("You must mention a user or provide their id!")
    person.addRole(verified).catch(console.error);
    message.channel.send("Successfully verified " + person.user.tag)
    }
  }

  if(command === "unverify"){
    if(message.member.roles.some(r=>["Support", "Moderator", "Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR")){
    let verified = message.guild.roles.find(role => role.name === "Verified");
    let person = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!person)
      return message.reply("You must mention a user or provide their id!")
    person.removeRole(verified).catch(console.error);
    message.channel.send("Successfully unverified " + person.user.tag)
    }
  }

  if(command === "gaccess"){
    if(message.member.roles.some(r=>["Support", "Moderator", "Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR")){
    let gaccess = message.guild.roles.find(role => role.name === "Giveaway Access");
    let gban = message.guild.roles.find(role => role.name === "Giveaway Ban");
    let person = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!person)
      return message.reply("You must mention a user or provide their id!")
    person.addRole(gaccess).catch(console.error);
    person.removeRole(gban).catch(console.error);
    message.channel.send("Successfully gave " + person.user.tag + " giveaway access")
  }

  if(command === "ungaccess"){
    if(message.member.roles.some(r=>["Support", "Moderator", "Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR")){
    let gaccess = message.guild.roles.find(role => role.name === "Giveaway Access");
    let gban = message.guild.roles.find(role => role.name === "Giveaway Ban");
    let person = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!person)
      return message.reply("You must mention a user or provide their id!")
    person.removeRole(gaccess).catch(console.error);
    message.channel.send("Successfully removed giveaway access from " + person.user.tag)
    }
  }
      
  if(command === "gban"){
    if(message.member.roles.some(r=>["Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR")){
    let gaccess = message.guild.roles.find(role => role.name === "Giveaway Access");
    let gban = message.guild.roles.find(role => role.name === "Giveaway Ban");
    let person = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!person)
      return message.reply("You must mention a user or provide their id!")
    person.removeRole(gaccess).catch(console.error);
    person.addRole(gban).catch(console.error);
    message.channel.send("Successfully removed giveaway access from " + person.user.tag)
    }
  }
    
  if(command === "massannounce" && message.guild.id === config.ids.cgc.server){
      if(message.member.roles.some(r=>["Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR")){
      client.channels.get(config.ids.cgc.announcements).send(sendmessage)
      client.channels.get(config.ids.owo.cgcannounce).send(sendmessage)
      client.channels.get(config.ids.uwu.cgcannounce).send(sendmessage)
      client.channels.get(config.ids.fbi.cgcannounce).send(sendmessage)
      }
  }

  if(command === "meme"){
    const embed = new Discord.RichEmbed();
    got('https://www.reddit.com/r/dankmemes/random/.json').then(response => {
        let content = JSON.parse(response.body);
        let permalink = content[0].data.children[0].data.permalink;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = content[0].data.children[0].data.url;
        let memeTitle = content[0].data.children[0].data.title;
        let memeUpvotes = content[0].data.children[0].data.ups;
        let memeDownvotes = content[0].data.children[0].data.downs;
        let memeNumComments = content[0].data.children[0].data.num_comments;
        embed.addField(`${memeTitle}`, `[View thread](${memeUrl})`);
        embed.setColor(16711680)
        embed.setImage(memeImage);
        embed.setFooter(`👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`);
        message.channel.send(embed)
            .then(sent => console.log(`Sent a reply to ${sent.author.username}`))
        console.log('Bot responded with: ' + memeImage);
    }).catch(console.error);
  }

  if (command === "eval") {
    if(config.eval.some(user => user === message.author.id) === false)
      return message.reply(":warning: You don't have permission to use that command! :warning:")
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }

});


function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

client.login(process.env.TOKEN);
