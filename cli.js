#!/usr/bin/env node
// @ts-nocheck
// Require modules
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { program } = require('commander');
const inquirer = require('inquirer');
const isThere = require("is-there").promises;
const mkdirp = require('mkdirp');
const cliProgress = require('cli-progress');
const wait = require('wait');
const isWritable = require("is-writable");
const pkg = require('./package.json');

const logger = {

    /**
     * @param {string} level
     * @param {string|Error} message
     * @param {NodeJS.WriteStream} out
     */
    _format(level, message, out) {
        out.write(`${chalk.dim('[')}${level}${chalk.dim(']')} > ${message}\n`);
    },

	/**
	 * Writes a newline to stdout.
	 */
	newline() {
		process.stdout.write('\n');
	},

    /**
     * Logs an informational message.
     *
     * @param {string|Error} message
     */
    info(message) {
        this._format(chalk.blue('info'), message, process.stdout);
    },

    /**
     * Logs a warning message.
     *
     * @param {string} message
     */
    warn(message) {
        this._format(chalk.yellow('warn'), message, process.stderr);
    },

    /**
     * Logs an error message.
     *
     * @param {string|Error} message
     */
    error(message) {
        this._format(chalk.red('error'), message, process.stderr);
    },

    /**
     * Logs an error message and terminates the program.

     * @param {string|Error} message
     */
    fail(message) {
        this.error(message);
        process.exit(-1);
    }
};

program
    .name('cli')
    .version(pkg.version)
    .description('Installs the theme files to a h5ai installation.')
    .arguments('<directory>');

program
    .option('--dry-run', 'runs the program without modifying any files');

program.on('option:dry-run', () => {
    logger.warn('Dry run enabled! Installation will be simulated.');
});

program.action(async (dir, options) => {
    const directory = path.resolve(dir);

    const overrides = require('./overrides.json');
	const h5aiTarget = path.join(directory, overrides.target);
	const papirusBase = path.resolve(overrides.papirusBase);

	if (! options.dryRun) {
		if (! await isWritable(directory).catch(logger.fail.bind(logger))) {
			logger.fail(`Directory ${chalk.underline(directory)} is not writable!`);
		}

		if (! await isThere.directory(directory).catch(logger.fail.bind(logger))) {
			logger.fail(`Directory ${chalk.underline(directory)} does not exist!`);
		}

		await mkdirp(h5aiTarget);

		for (const dirToCheck of [h5aiTarget, papirusBase]) {
			if (! await isThere.directory(dirToCheck).catch(logger.fail.bind(logger))) {
				logger.fail(`Directory ${chalk.underline(dirToCheck)} does not exist!`);
			}
		}
	}

	logger.newline();

	const progressBar = new cliProgress.SingleBar({
		format: `Working... | ${chalk.cyan('{bar}')} | ${chalk.magenta('{percentage}%')} || ${chalk.blue('{value}')}/${chalk.blue('{total}')} files copied`,
		hideCursor: true
	}, cliProgress.Presets.shades_classic);

	const toCopy = Object.keys(overrides.copy);
	progressBar.start(toCopy.length, 0);

	for (const targetFile of toCopy) {
		const targetAbsolute = path.join(h5aiTarget, targetFile);
		const sourceAbsolute = path.join(papirusBase, overrides.copy[targetFile]);

		try {
			if (options.dryRun) {
				await wait(250);
			} else {
				await fs.copyFile(sourceAbsolute, targetAbsolute);
			}
		} catch (error) {
			logger.error(error);
		}
		progressBar.increment();
	}

	logger.newline();

	progressBar.stop();
	logger.info('Done.');
});

(async () => {
    if (process.argv.slice(2, process.argv.length).length === 0) {
        program.help();
    } else {
        await program.parseAsync(process.argv);
    }
})();
