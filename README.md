<img src="https://www.lendsqr.com/assets/icons/header-logo.svg" align="center"  />

# Demo Credit for Lendsqr Backend Engineer Assessment

## Table of Contents

- [About](#about)
- [Tools](#tools)
- [Database](#database)
- [Environment Varaibles Setup](#env)
- [Test](#test)
- [Getting Started](#getting_started)
- [Usage](#usage)
<!-- - [OTP code](#otp) -->
- [Contributor](#contributor)

## About <a name = "about"></a> 🏦

Demo Credit is a consumable API platform that lets you created a financial future. On Demo Credit you can: create an account with zero charges 😮, transfer funds, and withdraw funds with zero delays. Th platform comes with high-level security, to make sure your funds are 💯 percent secured.

[Checkout API documentation](https://democredit-e88v.onrender.com)
## Tools  <a name = "tools"></a> ⚒️
The platform is heavily baked on the following tools:

<div style="display: flex; align-items: center">
<img src="https://knexjs.org/knex-logo.png" width="40"/> <b style="margin-left: 10px"> 

[Knex](https://knexjs.org/)
 </b>
</div>
<div style="display: flex; align-items: center; margin-top: 10px">
<img src="https://img.icons8.com/color/512/typescript.png" width="40"/> <b style="margin-left: 10px"> 

[Typescript](https://www.typescriptlang.org/)
</b>
</div>

<div style="display: flex; align-items: center; margin-top: 10px">
<img src="https://img.icons8.com/material-outlined/512/no-image.png" width="40"/> <b style="margin-left: 10px">

[ObjectionJS](https://vincit.github.io/objection.js/)
</b>
</div>

## Getting Started <a name = "getting_started"></a> 🏁

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

## Prerequisites 🖋️

To run this project in development, you need node install
This project was done using v16.13.1 but any other LTS should do.
Run the code below to check if Node is installed. it will return the version of Node installed.

```
node --version
```

You also need a package manager like npm [See guide if not installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/). yarn, works fine too.

```
npm --version
```

## Installing 💾

To get the code running locally, you need to clone it from the repo.

> For SSH

```
git clone git@github.com:iMiebaka/LBE.git
```

> For HTTP

```
git clone https://github.com/iMiebaka/LBE.git
```

Now the code has been pulled to your local machine, You'll have to move inside the project directory and install the neccesary dependancies 
```sh
cd LTS
npm i
```

## Environment Variable Setup 👁️ <a name = "env"></a>
Now the dependencies are installed, it's time to set up environmental variables Inside the project folder is a file called: 
> .env.example

That file contains the sample data required by this project
The env variables required are: secret key and database configuration
 <!-- and email(optional) -->
###### Secret key
This is private to the server. It's a lengthy combination of alpha-numeric characters to secure the platform. <span style="color:red"> This should not be disclosed ☠️</span>
###### Database
The database will take in the host, username, port, password and database name
<!-- ###### Email
To set up email you'll need the SMTP hostname, username and password -->
[See folder structure for more insight](https://github.com/iMiebaka/LBE/blob/master/.env.development)


## Database <a name = "database"></a> 🏁
<img alt="database_relationship_image" align="center" src="https://github.com/iMiebaka/LBE/blob/master/datbase-relations.png?raw=true">

To ensure this system relies on two databases:
Development Database
Testing Database
Production Database
> Test and Development databases are set up automatically. However, if you need to set up the enviroment variable first. 

[See setup guide](#env)


The database is MySQL. The database contains tables 
#### hot_data table 📋
> This table get all pending transactions during transfer and withdrawal

#### statement table 📋
> This table give a describive information about a completed transaction

#### users table 📋
>This table contains valuable details about the user. This details are gone when the account is created. i.e fist name, last name, email, password and pin (Default to 1234)
#### wallet table 📋
> This table is automatically generated when a user signs up on the platform, details. Details include: account name, amount, user reference

The two tables below are alias tables to help with data migrations
knex_migrations
knex_migrations_lock

Next, we need to migrate the table for test database. <span style="color:red"> Make sure your change NODE_ENV to test </span>
```sh
npm run migrate
```
Next, we need to make those tables available for the database. Here is the command to make the migrations. <span style="color:red"> To make this migration, you need to ensure the NODE_ENV is set to development. </span>. Now that's done, you can re-run the previous command.


## Testing <a name = "test"></a> 🧪
To test the workings of the project run this command
```sh
npm test
```

## Starting the Server 🌐

If your test works fine, you can now run the commannd. To get the code running locally, run the following script.

```
npm run dev
```

<!-- ## Getting OTP <a name = "otp"></a> 🗝️
##### When do I get it?

>The OTP is used to validate the user. This will be required when attempting to transfer or withdraw funds.

##### How to get it?

> The OTP code will be displayed on the logs during development, and the code will be sent via registered email during production. -->

## Contributor <a name = "contributor"></a> 👨‍💻️
[Miebaka Iwarri](https://github.com/iMiebaka)