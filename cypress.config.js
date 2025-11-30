const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://try123.labellerr.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 60000, // Increased for login
    video: false,
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      require('./cypress/plugins/index.js')(on, config)
      return config
    }
  }
})