const fs = require('fs')
const path = require('path')

module.exports = (on, config) => {
  on('task', {
    saveInteractionsToCSV: (interactions) => {
      try {
        if (!interactions || interactions.length === 0) {
          console.log(' No interactions to save')
          return null
        }

        // Create CSV headers
        const headers = Object.keys(interactions[0])
        let csv = headers.join(',') + '\n'
        
        // Add data rows
        interactions.forEach(interaction => {
          const row = headers.map(header => {
            let value = interaction[header] || ''
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              value = `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          csv += row.join(',') + '\n'
        })
        
        // Create filename and path
        const filename = `ui-interactions-${Date.now()}.csv`
        const filepath = path.join('cypress', 'results', filename)
        
        // Ensure directory exists
        const dir = path.dirname(filepath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        
        // Write file
        fs.writeFileSync(filepath, csv)
        console.log(`Interactions saved to: ${filepath}`)
        console.log(`Total interactions recorded: ${interactions.length}`)
        
        return `CSV saved: ${filepath} (${interactions.length} interactions)`
      } catch (error) {
        console.error(' Failed to save CSV:', error)
        throw error
      }
    }
  })

  return config
}