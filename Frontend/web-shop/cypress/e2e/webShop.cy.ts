describe('Web Shop', function () {
  it('front page can be opened', function () {
    cy.visit('http://localhost:5173')
    cy.contains('Welcome To My Webshop')
    cy.contains('Login')
    cy.contains('Create User')
  })

  it('User Can Be Created', function () {
    cy.visit('http://localhost:5173')
    cy.contains('Create User').click()
    cy.get('#email').type('cypress@email.com')
    cy.get('#username').type('cypress')
    cy.get('#password').type('password')
    cy.contains('Create User').click()
  })

  it('User Can Login', function () {
    cy.visit('http://localhost:5173')
    cy.contains('Login').click()
    cy.get('#email').type('cypress@email.com')
    cy.get('#password').type('password')
    cy.contains('Log In').click()
    cy.contains("Modar's Shop")
  })

  it('User Cannot Log in with wrong password', function () {
    cy.visit('http://localhost:5173')
    cy.contains('Login').click()
    cy.get('#email').type('cypress@email.com')
    cy.get('#password').type('wrong password')
    cy.contains('Log In').click()
    cy.contains("Wrong Password Try Again")
  })

  it('User Can Add Item To Cart', function () {
    cy.visit('http://localhost:5173')
    cy.contains('Login').click()
    cy.get('#email').type('cypress@email.com')
    cy.get('#password').type('password')
    cy.contains('Log In').click()
    const productName = 'Khaki Pants'
    cy.contains('.product', productName).within(() => {
      cy.get('.addToCartBttn').click()
    })
  })

  it('Shopping Cart Contains Selected Item', function () {
    cy.visit('http://localhost:5173')
    cy.contains('Login').click()
    cy.get('#email').type('cypress@email.com')
    cy.get('#password').type('password')
    cy.contains('Log In').click()
    cy.contains("Modar's Shop")
    const productName = 'Khaki Pants'
    cy.contains('.product', productName).within(() => {
      cy.get('.addToCartBttn').click()
    })
    const otherProduct = 'Denim Pants'
    cy.contains('.product', otherProduct).within(() => {
      cy.get('.addToCartBttn').click()
    })
    cy.get('.icon').click();
    cy.contains("Khaki Pants")
    cy.contains("Denim Pants")
    cy.contains("20€")
  })

})
