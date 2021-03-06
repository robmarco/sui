const webpack = require('webpack')
const clearConsole = require('react-dev-utils/clearConsole')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const chalk = require('chalk')
const ncp = require('copy-paste')

const isInteractive = process.stdout.isTTY
let compiler

const printInstructions = ({urls, copyToClipboard}) => {
  copyToClipboard && ncp.copy(urls.localUrlForBrowser)
  console.log(`
  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}
  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}
  `)
}

module.exports = (config, urls) => {
  try {
    compiler = webpack(config)
  } catch (err) {
    console.log(chalk.red('Failed to compile.'))
    console.log()
    console.log(err.message || err)
    console.log()
    process.exit(1)
  }

  compiler.hooks.invalid.tap('invalid', () => {
    if (isInteractive) {
      clearConsole()
    }
    console.log('Compiling...')
  })

  let isFirstCompile = true

  compiler.hooks.done.tap('done', stats => {
    if (isInteractive) {
      clearConsole()
    }

    const messages = formatWebpackMessages(stats.toJson({}, true))
    const isSuccessful = !messages.errors.length

    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'))
    }

    if (isSuccessful && isInteractive) {
      printInstructions({urls, copyToClipboard: isFirstCompile})
    }

    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1
      }
      console.log(chalk.red('Failed to compile.\n'))
      console.log(messages.errors.join('\n\n'))
    }

    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings:\n'))
      console.log(messages.warnings.join('\n\n'))
    }

    isFirstCompile = false
  })
  return compiler
}
