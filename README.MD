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
docker-compose up -d --build --env BOT_TOKEN=YOUBOTTOKEN --env LOCALE=ua --env GUILD_ID=111111111111111111
or
docker run -e BOT_TOKEN=YOUBOTTOKEN -e LOCALE=ua -e GUILD_ID=111111111111111111
```
or 


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