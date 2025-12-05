describe('Workspace Tests with Auth0 Login', () => {
  let interactions = []

  before(() => {
    interactions = []
  })

  after(() => {
    if (interactions.length > 0) {
      // Saving csv file
      cy.task('saveInteractionsToCSV', interactions, { timeout: 10000 }).then((result) => {
          if(result === null) cy.log('CSV Task result is null (check plugin setup)')
      })
    }
  })

  it('Login via Auth0 and Test Workspace', () => {
    // 1. Visit the workspace - this triggers the redirect to authorization
    cy.visit('https://aayushi-workspace.labellerr.com/workspace') //Change the workspace of your own
    
    cy.log('Waiting for redirect to Authorization.')

    // 2. Handle the Authorization Domain (Corrected Origin)
    cy.origin('https://labellerr.us.auth0.com', () => {
      // We are now inside the authorization page
      cy.log('manual lgon')
      
      // Verify the login form loaded
      cy.get('body').should('be.visible')
      
      // PAUSE execution here so you can type your credentials
      // Once you click "Sign In" and the page starts to redirect, click "Resume" in Cypress
      cy.pause()
    })

    // 3. Back at the Workspace 
    // Increase timeout to allow for the redirect dance to finish
    cy.url({ timeout: 30000 }).should('include', '/workspace')
    cy.log('Successfully returned to workspace. Starting crawler...')

    recordInteraction('login', 'auth0', 'Login complete', 'success')

    // 4. Dynamic Crawler
    // We scrape all navigation links first, then visit them one by one.
    cy.get('body').then(($body) => {
      // Find all links that point to the workspace
      // We look for relative links (starting with /) or absolute links to this domain
      const anchors = $body.find('a[href]')
      const uniqueUrls = new Set()

      anchors.each((i, el) => {
        const href = el.getAttribute('href')
        
        // Filter logic:
        // 1. Must not be empty or just '#'
        // 2. Must be internal (starts with /) OR match the worksapce domain
        // 3. Avoid logout links to prevent ending the session
        if (href && href !== '#' && !href.includes('logout') && !href.includes('signout')) {
          if (href.startsWith('/')) {
            uniqueUrls.add(`https://aayushi-workspace.labellerr.com${href}`)
          } else if (href.includes('https://aayushi-workspace.labellerr.com')) {
            uniqueUrls.add(href)
          }
        }
      })

      const urlsToTest = Array.from(uniqueUrls)
      cy.log(`Found ${urlsToTest.length} pages to test:`, urlsToTest)

      // Test every found URL
      cy.wrap(urlsToTest).each((url) => {
        testPage(url)
      })
    })
  })

  // Here are the helper functions
  function testPage(url) {
    cy.log(`Testing: ${url}`)
    cy.visit(url)
    
    // 1. Validate Load
    cy.get('body').should('be.visible')
    recordInteraction('navigation', 'visit', `Visited ${url}`, 'success')

    // 2. Check for UI Components
    const components = ['button', 'input', 'table', '.card']
    components.forEach(selector => {
      cy.get('body').then(($b) => {
        if ($b.find(selector).length > 0) {
          recordInteraction('audit', selector, `Found ${selector} on ${url}`, 'success')
        }
      })
    })

    // 3. Screenshot //This is optional. On Banasthali VPN server it times out due to SSL error
    const filename = url.replace(/[^a-zA-Z0-9]/g, '_').slice(-50)
    cy.screenshot(`audit_${filename}`)
  }

  function recordInteraction(action, element, description, status) {
    // We capture the URL inside the function to ensure it's current
    cy.url().then(currentUrl => {
      interactions.push({
        timestamp: new Date().toISOString(),
        action,
        element,
        description,
        status,
        url: currentUrl
      })
    })
  }
})
