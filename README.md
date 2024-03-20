# FullStack Makeshift Web Shop

This is my webshop App where I demonstrate my skills in creating a functional website
using **Typescript** with many libraries required.

* [Hourly Documentation](./tuntikirjnaptio.md)

### Description of Structure

* The app uses mongoDB for storing userdata 
    and the many products that i "sell" in the website

* The app uses token authentication using the jsonwebtoken 
    library to sign and verify the user token for various actions.

* The user password is encypted and the hash is stored in the backend

* The Frontend and the Backend communicate via API.

* The App uses Stripe Card Payment in the checkout process, the app itself is always in test mode. The payment works with the card `4242424242424242` (any future date and 3 digits.)

### Libraries used

* Express, React, Jsonwebtoken, Mongoose, Stripe, React-Router-Dom, FontAwsome, Flaticon, Cypress...  

I won't be listing all.


#### Download Intructions

* Run `npm install`

* In your terminal clone the latest version of this repository

* got to `WebShop/Backend`

* run `npm run build`

* run `npm run dev`

* To run the End to End tests run `npm run cypress:open`


### If you don't wish to clone the repository

* [Watch a demo of how the app works here](https://www.youtube.com/watch?v=14FIEzEQGaM&ab_channel=ModarAlGayal)



### Flaticon Art Credits:

* [References for the icon art in the site](./Frontend/references.md)