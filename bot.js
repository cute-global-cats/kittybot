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
  
  if (command === "rps") {
    let rock2 = ['Paper! I win!', 'Scissors! You win!']
    let rock1 = Math.floor(Math.random() * rock2.length);

    let paper2 = ['Rock! You win!', 'Scissors! I win!']
    let paper1 = Math.floor(Math.random() * paper2.length);

    let scissors2 = ['Rock! I win', 'Paper! You win!']
    let scissors1 = Math.floor(Math.random() * scissors2.length);

    let rock = new Discord.RichEmbed()
      .setAuthor('Rock, Paper, Scissors')
      .setColor(0x6B5858)
      .addField('You choose', `${args[0]}`)
      .addField('I choose', rock2[rock1])
      .setTimestamp()

    let paper = new Discord.RichEmbed()
      .setAuthor('Rock, Paper, Scissors')
      .setColor(0x6B5858)
      .addField('You choose', `${args[0]}`)
      .addField('I choose', paper2[paper1])
      .setTimestamp()

    let scissors = new Discord.RichEmbed()
      .setAuthor('Rock, Paper, Scissors')
      .setColor(0x6B5858)
      .addField('You choose', `${args[0]}`)
      .addField('I choose', scissors2[scissors1])
      .setTimestamp()

    if (message.content === prefix + 'rps rock') message.channel.send(rock)
    if (message.content === prefix + 'rps Rock') message.channel.send(rock)

    if (message.content === prefix + 'rps paper') message.channel.send(paper)
    if (message.content === prefix + 'rps Paper') message.channel.send(paper)

    if (message.content === prefix + 'rps scissors') message.channel.send(scissors)
    if (message.content === prefix + 'rps Scissors') message.channel.send(scissors)


    if (message.content === prefix + 'rps') message.channel.send(`please pick either rock, paper, or Scissors.`)




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
    if(!message.member.roles.some(r=>["Support", "Moderator", "Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR"))
      return
    let verified = message.guild.roles.find(role => role.name === "Verified");
    let person = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!person)
      return message.reply("You must mention a user or provide their id!")
    person.addRole(verified).catch(console.error);
    message.channel.send("Successfully verified " + person.user.tag)
  }

  if(command === "unverify"){
    if(!message.member.roles.some(r=>["Support", "Moderator", "Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR"))
      return
    let verified = message.guild.roles.find(role => role.name === "Verified");
    let person = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!person)
      return message.reply("You must mention a user or provide their id!")
    person.removeRole(verified).catch(console.error);
    message.channel.send("Successfully unverified " + person.user.tag)
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



function log(text) {
    let pingrole = message.guild.roles.find(role => role.name === "Kittybot Staff");
    pingrole.setMentionable(true)
    client.channels.get(config.logs).send(`<@&${pingrole.id}>\n\n>>> ${text}`)
    pingrole.setMentionable(false)
    }
}

client.login(process.env.TOKEN);
