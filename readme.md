# Block chain Market place

This project is a ecommerce website. The application serves 3 sets of users

  -  Owner: The owner of the application manages the users.
  -  User : A user is a visitor of the website.
  -  Vendor: A vendor is a user that has been approved by the owner to create and manage stores 
     and sell products

 The project is a  decentralized ecommerce application. Designed to run on the ethereum blockchain
 The project is build using the solidity programming language for the smart contracts.
 the client side application is a truffle project which uses react  to render the user interface
 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

   The following software will need to be installed on your computer inorder to run this project locally.
 
 [NodeJS ](https://nodejs.org/en/download/) 
 
 [Ganache clic](https://github.com/trufflesuite/ganache-cli) - personal blockchain for Ethereum development
   
```
  npm install -g ganache-cli
```

[Truffle ](https://github.com/trufflesuite/truffle) - Truffle is a development environment

```
 $ npm install -g truffle
```

### Installing
clone the project to a folder on your computer

```
git clone https://github.com/ysfkel/Blockchain-Market-place.git
```

cd into the folder install dependencies by running the following

```
npm install
```

start the local blockchain by running the following command in a command line

```
 ganache-cli
```
Before the next step, 
open the migrations folder , in the contracts migration file replace the 'OWNER' variable
with an account from  truffle cli that you choose to deploy the contracts with

Compile and migrate the smart contracts to the local blockchain

```
 truffle compile
```

```
 truffle migrate
```



## Running the application

  to test the application
  you should have 3 accounts from the ganache cli
  
  Choose and account for each role that you will test
  - Owner -  deploying accont -  
             click on manage tokens menu tab to enter amount to tokens to sell to customers
  - Vendor: use the account you choose for this role to request a venodr account,
            then switch to the owner account using meta mask, and approve the vendor request
            switch back to the vendor account to create stores and add products
            
  - customer: use this account to test purchasing of items 
               select any store, and , click on the products list 
               select a product and enter quantity and add to cart
               

### Running tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
