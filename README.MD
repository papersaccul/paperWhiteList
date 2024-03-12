# WhiteList Discord Bot
shit code for my personal single server use

U can use it as a base for their super-duper-mega bot by removing all my slag from /commands and piling on their own commands (all contents of the /command and /events folders are automatically read out)

## install
```sh
git clone https://github.com/papersaccul/paper_bot3
cd paper_bot3
npm i
```

## Start
U need create an `.env.production` or `.env.development` file, to store the `BOT_TOKEN`, `LOCALE`, `GUILD_ID` variable
```text
BOT_TOKEN=YOUBOTTOKEN
LOCALE=ua
GUILD_ID=111111111111111111
```
u can run it through npm
```sh
npm start
``` 
or through docker, u can also pass variables
```sh
docker-compose up -d
```

## U can use dev mode, which will autorestart the bot when files are changed
```sh
npm run dev
```
*uses variables from env.development, also the GUILD_ID variable of the test server is required*

# How do I use it?
- Create `FormWhiteList.json` in `./cfg`.\
There u can customize the form fields

- via `/set responsechannel` set the channel to which the completed form will be sent to

- via `/setupform` create a button for filling out the form

- via `/set acceptrole role:` and `/set rejectrole role:` set the roles that will be issued when this form is accepted or rejected (not required)

When accepted or rejected - a message is sent to the author of the form, which is specified in the localization file.

![showcase1](https://media.discordapp.net/attachments/1216039732178456626/1217182543527411752/image.png?ex=66031894&is=65f0a394&hm=67baa71e2803dd74a199e0282acb5f6385db32a4a98054eb74a19368ef334eaa&=&)

![showcase2](https://media.discordapp.net/attachments/1216039732178456626/1217183844763959386/image.png?ex=660319ca&is=65f0a4ca&hm=eff0cbcd55e915fb9f617c93cf8c1b6712890b15f858c2f8ccd02bb85bc09042&=&format=webp&quality=lossless&)

![showcase3](https://media.discordapp.net/attachments/1216039732178456626/1217184032920572104/image.png?ex=660319f7&is=65f0a4f7&hm=025384d0822423b16bba9d19cf19819f2402be77a595c6046cf78ae266406257&=&format=webp&)