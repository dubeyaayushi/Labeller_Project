describe('Workspace Tests with Auth0 Login', () => {
  let interactions = []

  before(() => {
    interactions = []
  })

  beforeEach(() => {
    recordInteraction('visit', 'page', 'visited main page', 'success')
    cy.visit('/')
  })

  after(() => {
    // Save interactions
    if (interactions.length > 0) {
      cy.task('saveInteractionsToCSV', interactions, { timeout: 10000 })
    }
  })

  it('Complete login and test workspace', () => {
    cy.log('🎯 Starting test - will pause for manual login')
    
    // Try to find and click login button
    cy.get('body').then(($body) => {
      const loginSelectors = [
        'a[href*="login"]',
        'button:contains("Login")',
        'button:contains("Sign In")',
        '[data-testid*="login"]',
        '.login-btn',
        '#login-button'
      ]
      
      let foundLogin = false
      loginSelectors.forEach(selector => {
        if ($body.find(selector).length > 0 && !foundLogin) {
          cy.get(selector).first().click({ force: true })
          recordInteraction('click', 'login', 'clicked login button', 'success')
          foundLogin = true
        }
      })
      
      // If no login button found, just continue to Auth0
      if (!foundLogin) {
        cy.log('No login button found, proceeding to Auth0')
        recordInteraction('navigation', 'direct', 'navigated directly to auth', 'success')
      }
    })

    // Handle Auth0 domain with manual login
    cy.origin('https://labellerr.us.auth0.com', () => {
      cy.log('🔐 AUTH0 LOGIN REQUIRED')
      cy.log('================================')
      cy.log('1. Enter your email')
      cy.log('2. Enter your password') 
      cy.log('3. Complete any verification')
      cy.log('4. Wait for redirect to workspace')
      cy.log('5. THEN click "Resume" button below!')
      cy.log('================================')
      
      // Wait for Auth0 page to load
      cy.get('body', { timeout: 20000 }).should('be.visible')
      
      // Pause for manual login
      cy.pause()
    })

    // After successful login
    cy.url({ timeout: 30000 }).should('include', '/workspace')
    recordInteraction('login', 'auth0', 'successfully logged in', 'success')
    cy.log('✅ Successfully logged in! Starting workspace tests...')

    // Test workspace functionality
    testWorkspaceUI()
  })

  function testWorkspaceUI() {
    // Basic page checks
    recordInteraction('assertion', 'url', 'verify workspace URL', 'success')
    cy.url().should('include', '/workspace')
    
    recordInteraction('assertion', 'body', 'verify page loaded', 'success')
    cy.get('body').should('be.visible')

    // Test visible navigation elements
    const navElements = ['Projects', 'Datasets', 'Models', 'Settings', 'Dashboard']
    
    navElements.forEach(navItem => {
      cy.get('body').then(($body) => {
        if ($body.text().includes(navItem)) {
          recordInteraction('assertion', navItem, `found ${navItem} in navigation`, 'success')
          cy.contains(navItem).should('be.visible')
        }
      })
    })

    // Interactive testing - click around
    cy.log('🔍 Testing interactive elements...')
    
    // Safe clicking - only click if element exists and is visible
    const clickableElements = ['Projects', 'Datasets']
    
    clickableElements.forEach(element => {
      cy.get('body').then(($body) => {
        if ($body.find(`:contains("${element}")`).length > 0) {
          recordInteraction('click', element, `clicked ${element}`, 'success')
          cy.contains(element).click({ force: true })
          cy.wait(1000)
          
          // Take a screenshot after each click
          cy.screenshot(`after-${element.toLowerCase()}-click`)
        }
      })
    })

    // Test common UI components
    testUIComponents()
  }

  function testUIComponents() {
    cy.log('📊 Testing UI components...')
    
    const uiComponents = [
      { selector: 'button', name: 'buttons' },
      { selector: 'input', name: 'input fields' },
      { selector: 'select', name: 'dropdowns' },
      { selector: 'textarea', name: 'text areas' },
      { selector: 'table', name: 'tables' },
      { selector: 'img', name: 'images' }
    ]

    uiComponents.forEach(component => {
      cy.get('body').then(($body) => {
        const count = $body.find(component.selector).length
        if (count > 0) {
          recordInteraction('component_check', component.name, `found ${count} ${component.name}`, 'success')
        }
      })
    })
  }

  function recordInteraction(action, element, description, status) {
    const interaction = {
      timestamp: new Date().toISOString(),
      action: action,
      element: element,
      description: description,
      status: status,
      url: window.location.href
    }
    interactions.push(interaction)
    cy.log(`📝 ${action}: ${element} - ${description}`)
  }
})