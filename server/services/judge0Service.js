const vm = require('vm');
const { spawn } = require('child_process');

const JUDGE0_LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  cpp: 54,        // C++ (GCC)
  java: 62,       // Java (OpenJDK)
};

/**
 * Execute code via Judge0 API if configured, or fall back to high-performance local sandbox
 */
class Judge0Service {
  constructor() {
    this.apiUrl = process.env.JUDGE0_API_URL || null;
    this.apiKey = process.env.JUDGE0_API_KEY || null;
    this.apiHost = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (this.apiKey) {
      headers['X-RapidAPI-Key'] = this.apiKey;
      headers['X-RapidAPI-Host'] = this.apiHost;
    }
    return headers;
  }

  /**
   * Run single execution via Judge0
   */
  async runWithJudge0(language, sourceCode, stdin = '') {
    const languageId = JUDGE0_LANGUAGE_IDS[language.toLowerCase()] || 63;
    const base = (this.apiUrl || 'https://ce.judge0.com').replace(/\/$/, '');
    const url = `${base}/submissions?wait=true&base64_encoded=false`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin || '',
        cpu_time_limit: 5,
        memory_limit: 128000,
      }),
      signal: AbortSignal.timeout(4000), // 4 second timeout
    });

    if (!response.ok) {
      throw new Error(`Judge0 status ${response.status}`);
    }

    const data = await response.json();
    return {
      stdout: (data.stdout || '').trim(),
      stderr: data.stderr || '',
      compileOutput: data.compile_output || '',
      message: data.message || '',
      time: data.time ? Math.round(parseFloat(data.time) * 1000) : 0,
      memory: data.memory || 0,
      status: data.status?.description || 'Accepted',
    };
  }

  /**
   * Robust Internal Sandbox runner for JavaScript
   */
  async runJavaScriptSandbox(sourceCode, stdin = '') {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let output = '';

      const mockFs = {
        readFileSync: () => stdin,
      };

      const sandbox = {
        console: {
          log: (...args) => {
            output += args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n';
          },
          error: (...args) => {
            output += args.join(' ') + '\n';
          },
          warn: () => {},
        },
        require: (mod) => {
          if (mod === 'fs') return mockFs;
          return {};
        },
        process: {
          exit: () => {},
          stdout: { write: (s) => { output += s; } },
          stdin: { on: () => {} },
        },
        input: stdin,
        setTimeout,
        clearTimeout,
        Buffer,
        BigInt,
        Map,
        Set,
        Math,
        Array,
        Object,
        Number,
        String,
        Boolean,
        RegExp,
        parseInt,
        parseFloat,
        isNaN,
        isFinite,
      };

      try {
        const context = vm.createContext(sandbox);
        const script = new vm.Script(sourceCode);
        script.runInContext(context, { timeout: 3000 });
        
        const duration = Date.now() - startTime;
        resolve({
          stdout: output.trim(),
          stderr: '',
          status: 'Accepted',
          time: duration,
          memory: 4096,
        });
      } catch (err) {
        const duration = Date.now() - startTime;
        resolve({
          stdout: output.trim(),
          stderr: err.message,
          status: err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' ? 'Time Limit Exceeded' : 'Runtime Error',
          time: duration,
          memory: 4096,
        });
      }
    });
  }

  /**
   * Internal Sandbox runner for Python (if Python is installed locally)
   */
  async runPythonSandbox(sourceCode, stdin = '') {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const pythonProcess = spawn('python', ['-c', sourceCode], { timeout: 4000 });
      let stdout = '';
      let stderr = '';

      if (stdin) {
        pythonProcess.stdin.write(stdin);
        pythonProcess.stdin.end();
      }

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code) => {
        const duration = Date.now() - startTime;
        if (code === 0) {
          resolve({
            stdout: stdout.trim(),
            stderr: '',
            status: 'Accepted',
            time: duration,
            memory: 6144,
          });
        } else {
          resolve({
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            status: 'Runtime Error',
            time: duration,
            memory: 6144,
          });
        }
      });

      pythonProcess.on('error', (err) => {
        resolve({
          stdout: '',
          stderr: `Python execution: ${err.message}. Please configure JUDGE0_API_KEY in .env or switch language to JavaScript.`,
          status: 'Runtime Error',
          time: 0,
          memory: 0,
        });
      });
    });
  }

  /**
   * Main unified execute method
   */
  async executeCode(language, sourceCode, stdin = '') {
    // 1. If Judge0 is configured explicitly (API key or custom URL), try Judge0
    if (this.apiKey || (this.apiUrl && this.apiUrl.trim())) {
      try {
        return await this.runWithJudge0(language, sourceCode, stdin);
      } catch (err) {
        console.warn(`[Judge0Service] Judge0 API request failed, falling back to local sandbox: ${err.message}`);
      }
    }

    // 2. High-performance sandbox fallback
    const lang = language.toLowerCase();
    if (lang === 'javascript') {
      return await this.runJavaScriptSandbox(sourceCode, stdin);
    } else if (lang === 'python') {
      return await this.runPythonSandbox(sourceCode, stdin);
    } else {
      // If compiled language like C++/Java and Judge0 is not configured, try public Judge0 CE once
      try {
        return await this.runWithJudge0(language, sourceCode, stdin);
      } catch (err) {
        return {
          stdout: '',
          stderr: `Compiled language (${language}) execution requires active Judge0 connection. Set JUDGE0_API_KEY or JUDGE0_API_URL in server/.env, or switch to JavaScript / Python.`,
          status: 'Compilation Error',
          time: 0,
          memory: 0,
        };
      }
    }
  }

  /**
   * Normalize output comparison ignoring line endings and trailing spaces
   */
  isOutputEqual(actual, expected) {
    if (!actual && !expected) return true;
    const cleanActual = String(actual || '').trim().replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '');
    const cleanExpected = String(expected || '').trim().replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '');
    return cleanActual === cleanExpected;
  }
}

module.exports = new Judge0Service();
