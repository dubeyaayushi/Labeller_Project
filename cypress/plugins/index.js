const { defineConfig } = require('cypress')
const fs = require('fs')
const path = require('path')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://aayushi-workspace.labellerr.com/workspace',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 60000,
    
    // Critical for Auth0 redirects to work
    chromeWebSecurity: false, 
    video: false,

    setupNodeEvents(on, config) {
      on('task', {
        saveInteractionsToCSV(interactions) {
          try {
            if (!interactions || interactions.length === 0) {
              console.log('No interactions to save')
              return null
            }

            // 1. Create CSV headers
            const headers = Object.keys(interactions[0])
            let csv = headers.join(',') + '\n'
            
            // 2. Add data rows with smart escaping
            interactions.forEach(interaction => {
              const row = headers.map(header => {
                let value = interaction[header] || ''
                // If data contains comma or quotes, wrap it in quotes to keep CSV valid
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                  value = `"${value.replace(/"/g, '""')}"`
                }
                return value
              })
              csv += row.join(',') + '\n'
            })
            
            // 3. Create filename with timestamp
            const filename = `ui-interactions-${Date.now()}.csv`
            // Save to 'cypress/results' folder
            const filepath = path.join('cypress', 'results', filename)
            
            // 4. Ensure directory exists
            const dir = path.dirname(filepath)
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true })
            }
            
            // 5. Write file
            fs.writeFileSync(filepath, csv)
            console.log(`Interactions saved to: ${filepath}`)
            console.log(`Total interactions recorded: ${interactions.length}`)
            
            // Return a success message (useful for debugging)
            return `CSV saved: ${filepath} (${interactions.length} interactions)`
          } catch (error) {
            console.error('Failed to save CSV:', error)
            throw error
          }
        }
      })

      return config
    }
  }
})
