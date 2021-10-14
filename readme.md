# CyberEmpire Bot

This is the official repository for The Cyber Empire's Discord bot. It is built with [TypeScript](https://www.typescriptlang.org/) using the [Sapphire](https://www.sapphirejs.com/) framework on top of the [discord.js library](https://discord.js.org/#/). We use the [Sequelize ORM](https://sequelize.org/) as database interface and [MariaDB](https://mariadb.org/) as primary database system.

## 👨‍💻 Start developing now

### **1.** Clone the repo

```sh
git clone https://github.com/CyberEmpire/discord-bot.git
```

### **2.** Install the dependencies

```sh
cd discord-bot && npm i
```

### **3.** Configure the environment variables in the `.env` file

Copying the template file.

```sh
cp .env_example .env
```

See details below on how to fill in variables.

### **4.** Build and test

```sh
npm test
```

## 🔩 Setting-up environment variables (`.env` file)

In this section we'll discuss how to fill properly the `.env` file, detailing the use of each variables.

> Note: This section assumes you already have a connection-ready database system and Discord Bot.

First open the file with the editor of your choice, the file should look like this:

```sh
DB_HOST="127.0.0.1"
DB_DATABASE="database_name"
DB_USER="user"
DB_PASS="secret"

BOT_TOKEN="Discord bot Token"
BOT_PREFIX="!"

GUILD_ID="Server ID"
```

Now you need to replace the placeholders with actual credentials/values. The **DB\_\*** variables are related to the database connection. You need to fill-in proper connection details (_Make sure that the user has all privileges on the database_). Next are the **BOT\_\*** variables, these variables are relative to the Discord Bot client. Only the **BOT_TOKEN** variable is required, the others are optionnal. Finally the **GUILD\_\*** variables corresponds to the Discord server you will bind the bot to. This is because the bot is not aimed to be a public bot but to be used on a single server.

## 🔧 Development tools

To help you in coding efficiently we recommend using Visual Studio Code with the following extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): For TypeScript/JavaScript linting.
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): This is the code formatter this repository uses. (Alternatively you can use the '`npm run format`' command)
- [JavaScript and TypeScript Nightly](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next): For better TS IntelliSense

## 📌 TO-DO

- THE REST OF THIS FILE
- Reproduce 1:1 the original bot
