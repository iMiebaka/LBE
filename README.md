<img src="https://www.lendsqr.com/assets/icons/header-logo.svg" align="center"  />

# Demo Credit by Lendsqr Backend Engineer Assessment

## Table of Contents

- [About](#about)
- [Tools](#tools)
- [Database](#database)
- [Environment varaible Setup](#env)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [OTP code](#otp)

## About <a name = "about"></a> 🏦

Demo Credit is a cunsumable API platform that let's you created a finacial feature
On demo credit you can: create and account with zero charges 😮, transfer funds, and withdraw funds with zero delays. Th plaform comes with high level security, to make sure your funds are 💯 percent secured.

[Checkout API documentation](https://democredit-e88v.onrender.com)
## Tools  <a name = "tools"></a> ⚒️

The plaform is heavily baked the following tools:

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

## Database <a name = "database"></a> 🏁
<img alt="database_relationship_image" align="center" src="https://github.com/iMiebaka/LBE/blob/master/datbase-relations.png?raw=true">

To ensure this system relies on two databases:
Development Database
Testing Database
Production Database
> Test and Development databases are set up automatically. However, if you need to set up the enviroment variable first. 

[See setup guide](#env)


The database is MySQL. The database contains for tables 
#### hot_data table 📋
> This table get all pending transactions during transfer and withdrawal

#### statement table 📋
> This table give a describive information about a completed transaction

#### users table 📋
>This table contains valuable details about the user. This details are gone when the account is created. i.e fist name, last name, email, password
#### wallet table 📋
> This table is automatically generated when a user signs up on the platform, details. Details include: account name, amount, user reference

The two tables below are alias table to help with migration of data
knex_migrations
knex_migrations_lock

Next, we need to migrate table for test database. <span style="color:red"> Make sure your change NODE_ENV to test </span>
```sh
npm run migrate
```
Next we, need to make those table available for the database. Here is the command to make the migrations. <span style="color:red"> To make this migration, you need to ensure the NODE_ENV is set to development. </span>. With than been done, you can re-run  the previous command.



## Getting Started <a name = "getting_started"></a> 🏁

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

## Prerequisites 🖋️

To run this project in development, you need node install
This project was done using v16.13.1 but any other LTS should do.
Run the code below to check if node is installed. it will return the version of node installed.

```
node --version
```

You also need a package manager like npm [See guide if not installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)
Other package manager like yarn, works fine too.

```
npm --version
```

## Installing 💾

To get the code running local, you need to clone it from the repo.

> For SSH

```
git clone git@github.com:iMiebaka/LBE.git
```

> For HTTP

```
git clone https://github.com/iMiebaka/LBE.git
```

Now the code has been pulled to your local machine, You'll have to move inside the project directory and install the neccesary dependancies

```
cd LBE
npm i
```

## Environment varaible Setup 👁️ <a name = "env"></a>

Now th dependencies are install, it's time to set up enviroment variables
Inside project folder is file called: 
> .env.example

That file contains the sample data required by this project
The env setup required are for secretkey, database and email (optional)
###### Secret key
This is private to the server, it's lengthy combination of alpha-numeric charater to secure the system. <span style="color:red"> This should not be disclosed ☠️</span>
###### Database
The database will take in the host, username, port, password and database name
###### Email
To set up email you'll need the smtp hostname, username and password


[See folder stucture for more insight]()
<!-- ## Usage <a name = "usage"></a> -->

## Getting OTP <a name = "otp"></a> 🗝️

##### When do i get it?

>The OTP is used to validate the user. This will be required when attempting to transfer or withdraw funds.

##### How to get it?

> The OTP code will be displayed on the logs during development, and the code will be sent via registered email during production.

