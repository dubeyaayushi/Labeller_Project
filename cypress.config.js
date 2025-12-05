const { defineConfig } = require('cypress')
const fs = require('fs') // Required to write the CSV file

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://aayushi-workspace.labellerr.com/workspace', //Mention a different workspace if needed
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 60000,
    // chromeWebSecurity is often needed for cross-domain Auth redirects
    chromeWebSecurity: false, 
    video: false,
    
    setupNodeEvents(on, config) {
      // 1. Keep your existing plugins file if you need it
      // require('./cypress/plugins/index.js')(on, config)

      // 2. Define the task to save the CSV
      on('task', {
        saveInteractionsToCSV(interactions) {
          // Defining the CSV Header
          const header = 'Timestamp,Action,Element,Description,Status,URL\n'
          
          // Map the interactions array to CSV rows
          // We wrap fields in quotes "..." to handle commas inside descriptions safely
          const rows = interactions.map(item => {
            return `"${item.timestamp}","${item.action}","${item.element}","${item.description}","${item.status}","${item.url}"`
          }).join('\n')
          
          const csvContent = header + rows

          // Write the file to the root of your project
          fs.writeFileSync('test_interactions.csv', csvContent)
          
          console.log('✅ CSV saved to test_interactions.csv')
          return null // Cypress tasks must return null or a value
        }
      })

      return config
    }
  }
})
