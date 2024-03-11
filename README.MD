# WhiteList Discord Bot
shit code for my personal single server use

U can use it as a base for their super-duper-mega bot by removing all my slag from /commands and piling on their own commands (all contents of the /command and /events folders are automatically read out)

## install
```sh
git clone https://github.com/papersaccul/paper_bot3`
cd paper_bot3
npm i
```

## Start
U need create an .env.production file, to store the `BOT_TOKEN` variable, or pass it through docker

```sh
docker-compose up -d
```
or 
```sh
npm start
``` 

## U can use dev mode, which will autorestart the bot when files are changed
```sh
npm run dev
```


