'use strict';

var node_fs = require('node:fs');
var nodePath = require('node:path');
var require$$0 = require('fs');
var require$$1 = require('path');
var require$$2 = require('os');
var require$$3 = require('crypto');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var nodePath__namespace = /*#__PURE__*/_interopNamespaceDefault(nodePath);

var main$1 = {exports: {}};

var name = "dotenv";
var version = "16.4.5";
var description = "Loads environment variables from .env file";
var main = "lib/main.js";
var types = "lib/main.d.ts";
var exports$1 = {
	".": {
		types: "./lib/main.d.ts",
		require: "./lib/main.js",
		"default": "./lib/main.js"
	},
	"./config": "./config.js",
	"./config.js": "./config.js",
	"./lib/env-options": "./lib/env-options.js",
	"./lib/env-options.js": "./lib/env-options.js",
	"./lib/cli-options": "./lib/cli-options.js",
	"./lib/cli-options.js": "./lib/cli-options.js",
	"./package.json": "./package.json"
};
var scripts = {
	"dts-check": "tsc --project tests/types/tsconfig.json",
	lint: "standard",
	"lint-readme": "standard-markdown",
	pretest: "npm run lint && npm run dts-check",
	test: "tap tests/*.js --100 -Rspec",
	"test:coverage": "tap --coverage-report=lcov",
	prerelease: "npm test",
	release: "standard-version"
};
var repository = {
	type: "git",
	url: "git://github.com/motdotla/dotenv.git"
};
var funding = "https://dotenvx.com";
var keywords = [
	"dotenv",
	"env",
	".env",
	"environment",
	"variables",
	"config",
	"settings"
];
var readmeFilename = "README.md";
var license = "BSD-2-Clause";
var devDependencies = {
	"@definitelytyped/dtslint": "^0.0.133",
	"@types/node": "^18.11.3",
	decache: "^4.6.1",
	sinon: "^14.0.1",
	standard: "^17.0.0",
	"standard-markdown": "^7.1.0",
	"standard-version": "^9.5.0",
	tap: "^16.3.0",
	tar: "^6.1.11",
	typescript: "^4.8.4"
};
var engines = {
	node: ">=12"
};
var browser = {
	fs: false
};
var require$$4 = {
	name: name,
	version: version,
	description: description,
	main: main,
	types: types,
	exports: exports$1,
	scripts: scripts,
	repository: repository,
	funding: funding,
	keywords: keywords,
	readmeFilename: readmeFilename,
	license: license,
	devDependencies: devDependencies,
	engines: engines,
	browser: browser
};

var hasRequiredMain;
function requireMain() {
  if (hasRequiredMain) return main$1.exports;
  hasRequiredMain = 1;
  const fs = require$$0;
  const path = require$$1;
  const os = require$$2;
  const crypto = require$$3;
  const packageJson = require$$4;
  const version = packageJson.version;
  const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;

  // Parse src into an Object
  function parse(src) {
    const obj = {};

    // Convert buffer to string
    let lines = src.toString();

    // Convert line breaks to same format
    lines = lines.replace(/\r\n?/mg, '\n');
    let match;
    while ((match = LINE.exec(lines)) != null) {
      const key = match[1];

      // Default undefined or null to empty string
      let value = match[2] || '';

      // Remove whitespace
      value = value.trim();

      // Check if double quoted
      const maybeQuote = value[0];

      // Remove surrounding quotes
      value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2');

      // Expand newlines if double quoted
      if (maybeQuote === '"') {
        value = value.replace(/\\n/g, '\n');
        value = value.replace(/\\r/g, '\r');
      }

      // Add to object
      obj[key] = value;
    }
    return obj;
  }
  function _parseVault(options) {
    const vaultPath = _vaultPath(options);

    // Parse .env.vault
    const result = DotenvModule.configDotenv({
      path: vaultPath
    });
    if (!result.parsed) {
      const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
      err.code = 'MISSING_DATA';
      throw err;
    }

    // handle scenario for comma separated keys - for use with key rotation
    // example: DOTENV_KEY="dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=prod,dotenv://:key_7890@dotenvx.com/vault/.env.vault?environment=prod"
    const keys = _dotenvKey(options).split(',');
    const length = keys.length;
    let decrypted;
    for (let i = 0; i < length; i++) {
      try {
        // Get full key
        const key = keys[i].trim();

        // Get instructions for decrypt
        const attrs = _instructions(result, key);

        // Decrypt
        decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
        break;
      } catch (error) {
        // last key
        if (i + 1 >= length) {
          throw error;
        }
        // try next key
      }
    }

    // Parse decrypted .env string
    return DotenvModule.parse(decrypted);
  }
  function _log(message) {
    console.log(`[dotenv@${version}][INFO] ${message}`);
  }
  function _warn(message) {
    console.log(`[dotenv@${version}][WARN] ${message}`);
  }
  function _debug(message) {
    console.log(`[dotenv@${version}][DEBUG] ${message}`);
  }
  function _dotenvKey(options) {
    // prioritize developer directly setting options.DOTENV_KEY
    if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
      return options.DOTENV_KEY;
    }

    // secondary infra already contains a DOTENV_KEY environment variable
    if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
      return process.env.DOTENV_KEY;
    }

    // fallback to empty string
    return '';
  }
  function _instructions(result, dotenvKey) {
    // Parse DOTENV_KEY. Format is a URI
    let uri;
    try {
      uri = new URL(dotenvKey);
    } catch (error) {
      if (error.code === 'ERR_INVALID_URL') {
        const err = new Error('INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development');
        err.code = 'INVALID_DOTENV_KEY';
        throw err;
      }
      throw error;
    }

    // Get decrypt key
    const key = uri.password;
    if (!key) {
      const err = new Error('INVALID_DOTENV_KEY: Missing key part');
      err.code = 'INVALID_DOTENV_KEY';
      throw err;
    }

    // Get environment
    const environment = uri.searchParams.get('environment');
    if (!environment) {
      const err = new Error('INVALID_DOTENV_KEY: Missing environment part');
      err.code = 'INVALID_DOTENV_KEY';
      throw err;
    }

    // Get ciphertext payload
    const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
    const ciphertext = result.parsed[environmentKey]; // DOTENV_VAULT_PRODUCTION
    if (!ciphertext) {
      const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
      err.code = 'NOT_FOUND_DOTENV_ENVIRONMENT';
      throw err;
    }
    return {
      ciphertext,
      key
    };
  }
  function _vaultPath(options) {
    let possibleVaultPath = null;
    if (options && options.path && options.path.length > 0) {
      if (Array.isArray(options.path)) {
        for (const filepath of options.path) {
          if (fs.existsSync(filepath)) {
            possibleVaultPath = filepath.endsWith('.vault') ? filepath : `${filepath}.vault`;
          }
        }
      } else {
        possibleVaultPath = options.path.endsWith('.vault') ? options.path : `${options.path}.vault`;
      }
    } else {
      possibleVaultPath = path.resolve(process.cwd(), '.env.vault');
    }
    if (fs.existsSync(possibleVaultPath)) {
      return possibleVaultPath;
    }
    return null;
  }
  function _resolveHome(envPath) {
    return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath;
  }
  function _configVault(options) {
    _log('Loading env from encrypted .env.vault');
    const parsed = DotenvModule._parseVault(options);
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsed, options);
    return {
      parsed
    };
  }
  function configDotenv(options) {
    const dotenvPath = path.resolve(process.cwd(), '.env');
    let encoding = 'utf8';
    const debug = Boolean(options && options.debug);
    if (options && options.encoding) {
      encoding = options.encoding;
    } else {
      if (debug) {
        _debug('No encoding is specified. UTF-8 is used by default');
      }
    }
    let optionPaths = [dotenvPath]; // default, look for .env
    if (options && options.path) {
      if (!Array.isArray(options.path)) {
        optionPaths = [_resolveHome(options.path)];
      } else {
        optionPaths = []; // reset default
        for (const filepath of options.path) {
          optionPaths.push(_resolveHome(filepath));
        }
      }
    }

    // Build the parsed data in a temporary object (because we need to return it).  Once we have the final
    // parsed data, we will combine it with process.env (or options.processEnv if provided).
    let lastError;
    const parsedAll = {};
    for (const path of optionPaths) {
      try {
        // Specifying an encoding returns a string instead of a buffer
        const parsed = DotenvModule.parse(fs.readFileSync(path, {
          encoding
        }));
        DotenvModule.populate(parsedAll, parsed, options);
      } catch (e) {
        if (debug) {
          _debug(`Failed to load ${path} ${e.message}`);
        }
        lastError = e;
      }
    }
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsedAll, options);
    if (lastError) {
      return {
        parsed: parsedAll,
        error: lastError
      };
    } else {
      return {
        parsed: parsedAll
      };
    }
  }

  // Populates process.env from .env file
  function config(options) {
    // fallback to original dotenv if DOTENV_KEY is not set
    if (_dotenvKey(options).length === 0) {
      return DotenvModule.configDotenv(options);
    }
    const vaultPath = _vaultPath(options);

    // dotenvKey exists but .env.vault file does not exist
    if (!vaultPath) {
      _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
      return DotenvModule.configDotenv(options);
    }
    return DotenvModule._configVault(options);
  }
  function decrypt(encrypted, keyStr) {
    const key = Buffer.from(keyStr.slice(-64), 'hex');
    let ciphertext = Buffer.from(encrypted, 'base64');
    const nonce = ciphertext.subarray(0, 12);
    const authTag = ciphertext.subarray(-16);
    ciphertext = ciphertext.subarray(12, -16);
    try {
      const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, nonce);
      aesgcm.setAuthTag(authTag);
      return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
    } catch (error) {
      const isRange = error instanceof RangeError;
      const invalidKeyLength = error.message === 'Invalid key length';
      const decryptionFailed = error.message === 'Unsupported state or unable to authenticate data';
      if (isRange || invalidKeyLength) {
        const err = new Error('INVALID_DOTENV_KEY: It must be 64 characters long (or more)');
        err.code = 'INVALID_DOTENV_KEY';
        throw err;
      } else if (decryptionFailed) {
        const err = new Error('DECRYPTION_FAILED: Please check your DOTENV_KEY');
        err.code = 'DECRYPTION_FAILED';
        throw err;
      } else {
        throw error;
      }
    }
  }

  // Populate process.env with parsed values
  function populate(processEnv, parsed, options = {}) {
    const debug = Boolean(options && options.debug);
    const override = Boolean(options && options.override);
    if (typeof parsed !== 'object') {
      const err = new Error('OBJECT_REQUIRED: Please check the processEnv argument being passed to populate');
      err.code = 'OBJECT_REQUIRED';
      throw err;
    }

    // Set process.env
    for (const key of Object.keys(parsed)) {
      if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
        if (override === true) {
          processEnv[key] = parsed[key];
        }
        if (debug) {
          if (override === true) {
            _debug(`"${key}" is already defined and WAS overwritten`);
          } else {
            _debug(`"${key}" is already defined and was NOT overwritten`);
          }
        }
      } else {
        processEnv[key] = parsed[key];
      }
    }
  }
  const DotenvModule = {
    configDotenv,
    _configVault,
    _parseVault,
    config,
    decrypt,
    parse,
    populate
  };
  main$1.exports.configDotenv = DotenvModule.configDotenv;
  main$1.exports._configVault = DotenvModule._configVault;
  main$1.exports._parseVault = DotenvModule._parseVault;
  main$1.exports.config = DotenvModule.config;
  main$1.exports.decrypt = DotenvModule.decrypt;
  main$1.exports.parse = DotenvModule.parse;
  main$1.exports.populate = DotenvModule.populate;
  main$1.exports = DotenvModule;
  return main$1.exports;
}

var mainExports = requireMain();

const transformEnv = (env) => {
    const transformed = {};
    Object.keys(env).forEach(key => {
        const value = env[key];
        if (/^\d+(\.\d+)?$/.test(value)) {
            // 可以转成数字类型
            transformed[key] = Number(value);
        }
        else if (value === 'true' || value === 'false') {
            // 可以转成布尔类型
            transformed[key] = Boolean(value);
        }
        else {
            // 其他类型都转成字符串类型
            transformed[key] = String(value);
        }
    });
    return transformed;
};
const createEnvTypes = (values, dto) => {
    let envTypes = `/* eslint-disable */
/**
* ${dto}
*  This file is automatically generated by 'rollup-plugin-inject-dotenv' plugin. 
*  Use 'dotenv' npm package to load your environment variables from .env file.
*  You can also manually edit this file to add or remove environment variables.
*  Global environment variables.
*/

/**
* Global environment variables.
*/
export interface GlobalEnv {
`;
    Object.keys(values).forEach(key => {
        const value = values[key];
        if (typeof value === 'number') {
            // 可以转成数字类型
            envTypes += `   ${key}: number;\n`;
        }
        else if (typeof value === 'boolean') {
            // 可以转成布尔类型
            envTypes += `   ${key}: boolean;\n`;
        }
        else {
            // 其他类型都转成字符串类型
            envTypes += `   ${key}: string;\n`;
        }
    });
    envTypes += `}\n`;
    envTypes += `declare global{\n  const ENV: GlobalEnv;\n}\nexport {};`;
    const dtoPath = nodePath__namespace.dirname(dto);
    if (dtoPath && !nodePath__namespace.isAbsolute(dtoPath)) {
        node_fs.mkdirSync(dtoPath, { recursive: true });
    }
    // 写入dist/env.d.ts
    node_fs.writeFileSync(dto, envTypes);
    console.log('rollup-plugin-inject-dotenv global env types：', dto, ' generated successfully.');
};
const defaultOptions = {
    mode: "",
    dto: "env.d.ts",
    env: {},
    path: ".env",
};
const injectEnv = (options = defaultOptions) => {
    const { mode = '', path = '.env', dto = 'env.d.ts', env = {} } = options;
    const envKeys = Object.keys(env);
    let addWatched = false; // 是否监听.env文件变化
    if (options.mode) {
        options.path = `.env.${mode}`;
    }
    const envFile = options.path; // 环境变量文件路径
    return {
        name: "rollup-plugin-inject-dotenv",
        buildStart() {
            const c = mainExports.config({ path: envFile }).parsed || {};
            Object.assign(env, transformEnv(c), { ...env });
            createEnvTypes(env, dto);
            if (!addWatched) {
                this.addWatchFile(envFile); // listen to .env file changes
                addWatched = true;
            }
        },
        renderChunk(code, chunk) {
            if (chunk.isEntry) {
                // entry file needs to be modified to inject environment variables
                return `window.ENV = ${JSON.stringify(env)};${code}`;
            }
            return code;
        },
        watchChange() {
            createEnvTypes(env, dto);
        },
        buildEnd() {
            if (envKeys.length > 0) {
                this.warn(`Environment variables injected: ${envKeys.join(', ')}`);
            }
        },
    };
};

module.exports = injectEnv;
