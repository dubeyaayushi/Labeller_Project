# Cypress UI Testing Framework with CSV Reporting

A minimal Cypress framework for testing UI interactions with automatic CSV reporting.

## 📁 Project Structure

```
cypress-labellerr-test/
├── cypress/
│   ├── e2e/
│   │   └── workspace-test.cy.js    # Main test file
│   ├── support/
│   │   └── e2e.js                  # Support file
│   ├── plugins/
│   │   └── index.js                # CSV saving functionality
│   └── results/                    # CSV reports saved here
├── cypress.config.js               # Cypress configuration
└── package.json                    # Dependencies
```

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install cypress --save-dev
```
### Step 2: Open Cypress GUI
```bash
npx cypress open
```

### Step 4: Configure Cypress (First Time Only)
1. In Cypress GUI, select **"E2E Testing"**
2. Choose **"Electron"** as browser (bypasses human verification)
3. Click **"Start E2E Testing in Electron"**

### Step 5: Run the Test
1. Click on **"workspace-test.cy.js"** in the test list
2. Follow the manual login steps when prompted
3. Watch automated testing continue after login

## When you run the framework

1. **Enter your email** in the Auth0 login form
2. **Enter your password** 
4. **Click login button**
5. **Wait for redirect** to Labellerr workspace
6. Then, whatever actions you perform in the workspace are stored in the csv file in ``cypress\results`` folder.

## 📊 CSV Reporting

After test completion, interactions are automatically saved to:
```
cypress/results/ui-interactions-[timestamp].csv
```

### CSV Columns:
- `timestamp`: When the interaction occurred
- `action`: Type of action (click, assertion, etc.)
- `element`: UI element interacted with
- `description`: What was tested
- `status`: Success/failure status
- `url`: Page URL where interaction occurred

## 🎯 Available Commands

### Open Cypress GUI (Recommended)
```bash
npx cypress open
```


## 📝 Test Features

- **Handles Auth0 cross-domain login**
- **Pauses for manual authentication**
- **Records all UI interactions**
- **Automatic CSV reporting**
- **Visual testing with screenshots**
- **Works with Electron browser**
