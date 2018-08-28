# Block chain Market place
### Please see the section titled ' Running the application 2 - Application flow.' for a complete guide on running the application
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
  you should have 3 accounts from  ganache cli
  
  choose set aside one account for the foloowing role: 
  - Owner / Admin : Will approve potential vendors request for a vendor account
  - Vendor - Will place a vendor request, if accepted by admin, the following options will appear after switching back to vendor account
             from meta mask
             - Create Store, Manage Stores.
             
  - Customer: Will browse stores, products and make purchases.
  
  ## Running the application 2 - Application flow.
  
   Use metamask to switch between accounts Note , run ganache - cli and import three accounst into meta mask
 - OWNER ACCOUNT
   - 1) Switch to Owner account
    -2) In the migrations folder, the 2_deploy_contract migration, set Owner to the address you choose to be owner / Admin
       - 'run truffle migrate' to deploy
    -3) If the application loads and the menu displays the owners account , you are all set to begin, else check your network settings.
    -4) Click on 'manage Tokan Sale' and enter the amount of tokens you wish to sell to customers. click sale and confirm transaction with
       meta mask.
  - VENDOR ACCOUNT:
      -5)Switch to vendor account, refresh page, click on 'Vendor Request' and confirm transaction with metamask.
  - OWNER ACCOUNT:
     - 6) Switch back to Owner account, click on 'Manage Vendors'
     - 7) click on the pending vendor account to navigate to details
     - 8) Click on 'Approve Vendor'
  - VENDOR ACCOUNT:
     - 9) Switch back to vendor account using metamask.
     - 10) Click on create Store,
     - 11) enter store name and description and save
     - 12 confirm transaction with metamask
     - 14) Click on Manage stores
     - 15) Click on products
     - 16) click on 'Add Product'
     - 17) Enter product details and save
     - 18 Confirm transaction with metamask - 
     - 19) when the transaction is completed, image upload will appear which uploads product image IPFS
     - 20) select a image file and click upload - wait for upload to comple and a dialog will appear which will prompt you
          to update the product which is saved on the blockchain with the uploaded file hash
     - 21) When the modal appears, click update and confirm transaction with  metamask.
    
   - CUSTOMER:
      - 22) Switch to customer account
      - 23) refersh browser and click on Stores
      - 24) when stores page appears select a store and click 'shop'to open the stores products list
      - 25) selected a product 
      - 26) enter quantity and click add to cart , confirm transaction with metamask
      - 28) click on shopping cart
      - 29) select payment method ether or Token
      - 30) if Token
      - 31) buy tokens from the 'buy token page' - make sure you buy enough tokens to pay for the cart price
      - 32) click on Pay with a modal appears which propmts you to permit the application to transfer the tokens payment
           from your account to the vendors accoun.
      - 33) click 'approve', confirm transaction with metamask
      - 34) wait for transaction to compete and modal to disappear by itsself.
      - 35) click on complete payment and confirm transaction with metamask
      - 36) click on Order History to see completed transation
                 

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


