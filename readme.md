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

   The following software will be needed to be installed on your computer inorder to run this project locally.
 
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

 This project constaians a suite of tests that verify the functionality of the contracts code
 
 These tests cover the following contracts
 -OrderHIstoryManager: Tests verify if the customers order is archived in order history after purchase is completed
 -ProductManager: Tests the functionality of adding, updtating and deleting products
 -ShoppingCartManager: Test the functionality of adding item to a cart, updating, deleting an item and completing purchase
                        as well is products quantity reduction and payment made to the respective vendors
 -SpinelToken: Tests the functionality of the ERC20 TOKEN
 -SpinelTokenSale: Tests the functionality of allowing users to buy Tokens
 -StoreManager: Tests the functionality of the StoreMnager -  Adding, editting and deleting stores 
 -VendorManager: Tests the functionality of VendorManager which allows admin/owner to manage vendors
 -Withdrawable: Tests the functionality of allowing vendors to move funds to their wallet
 
 

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

* [Truffle](https://truffleframework.com/) - Truffle Framework
* [React](https://reactjs.org/) - UI Library
* [Solidity](https://solidity.readthedocs.io/en/v0.4.24/) - Programming language
* [Ethereum](https://www.ethereum.org/) - Blockchain Protocol
* [IPFS](https://rometools.github.io/rome/) - decentralized file storage

 

## Authors

* **Yusuf Kelo** - *Initial work* - [Blockchain-Market-Place](https://github.com/ysfkel/Blockchain-Market-Place)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.


