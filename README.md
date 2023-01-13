<img src="https://www.lendsqr.com/assets/icons/header-logo.svg" align="center"  />

# Demo Credit for Lendsqr Backend Engineer Assessment

## Table of Contents

- [About](#about)
- [Tools](#tools)
- [Getting Started](#getting_started)
- [Database](#database)
- [Environment Variables Setup](#env)
- [Test](#test)
<!-- - [OTP code](#otp) -->
- [Author](#contributor)

## About <a name = "about"></a> 🏦

Demo Credit is a consumable API platform that lets you create a financial future. On Demo Credit you can: create an account with zero charges, transfer funds, and withdraw funds with zero delays. The platform comes with high-level security, to make sure your funds are 💯 percent secured.

[Checkout API documentation](https://miebakaiwarri-lendsqr-be-test.onrender.com)
## Tools  <a name = "tools"></a> ⚒️
The platform is heavily based on the following tools:
   
      
      
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
These instructions will guide you on how to get this project up and running.

## Prerequisites 

To run this project in development, you need node install
This project was done using v16.13.1 but any other LTS should do.
Run the code below to check if Node is installed. it will return the version of Node installed.

```
node --version
```

```
npm --version
```

## Installing 

To get the code running locally, you need to clone it from the repo.
> For SSH

```
git clone git@github.com:iMiebaka/LBE.git
```

> For HTTP

```
git clone https://github.com/iMiebaka/LBE.git
```

Now the code has been pulled to your local machine, You'll have to move inside the project directory and install the dependencies. 
```sh
cd LTS
npm i
```

## Environment Variable Setup  <a name = "env"></a>
Now the dependencies are installed, it's time to set up environment variables Inside the project folder is a file called:
> .env.example

That file contains the sample data required by this project
The env variables required are: the secret key and database configuration
 <!-- and email(optional) -->
###### Secret key
This is private to the server. It should be a lengthy combination of alpha-numeric characters to secure the platform. <span style="color:red"> This should not be disclosed ☠️</span>
###### Database
The database will take in the host, username, port, password and database name
<!-- ###### Email
To set up email you'll need the SMTP hostname, username and password -->
[See folder structure for more insight](https://github.com/iMiebaka/LBE/blob/master/.env.development)


## Database <a name = "database"></a> 🛢️
The database used is MySQL. And here is the relationship diagram.
<img alt="database_relationship_image" align="center" src="https://github.com/iMiebaka/LBE/blob/master/datbase-relations.png?raw=true">

The database contains the following tables and fields.
#### hot_wire_transaction table 📋
> This table gets all pending transactions during transfer and withdrawal

#### statement table 📋
> This table gives descriptive information about completed transaction

#### users table 📋
>This table contains valuable details about the user. These details are added when the account is created. i.e first name, last name, email, password and pin (Default to 1234)
#### wallet table 📋
> This table is automatically generates when a user signs up on the platform. Details include: account number, amount (Default to 0.0), user reference

NB: Knex generates two tables extra alias tables to help with data migrations
knex_migrations
knex_migrations_lock

Next, we need to migrate the tables to the database. Use the command below. <span style="color:red"> Make sure you set NODE_ENV </span>
```sh
npm run migrate
```

## Testing <a name = "test"></a> 🧪
This project testing is broken into two stages: One is to test database connection, and the other test the user activities.
The first test checks if the database connection is established. This is important because without it data persistence cannot work.
The second test does the following: creates two tests user account, log in, funds the wallet, withdraw amounts, and transfer funds. This test depends on the success of the first test.
To see the test in action run the command below:
```sh
npm test
```

## Starting the Server 🌐

If your test works fine, you can now run the command. To get the code running locally, run the following script.

```
npm run dev
```

<!-- ## Getting OTP <a name = "otp"></a> 🗝️
##### When do I get it?

>The OTP is used to validate the user. This will be required when attempting to transfer or withdraw funds.

##### How to get it?

> The OTP code will be displayed on the logs during development, and the code will be sent via registered email during production. -->

## Author <a name = "contributor"></a> 👨‍💻️
[Miebaka Iwarri](https://github.com/iMiebaka)
