#!/usr/bin/env node

/**
 * Command Line Interface (CLI) for 8-Bit CPU Compiler
 * 
 * Professional-grade command-line interface providing comprehensive access to
 * all compiler functionality. Designed for both interactive use and build automation.
 * 
 * CLI Design Philosophy:
 * - Intuitive argument structure following POSIX conventions
 * - Comprehensive help system with examples
 * - Graceful error handling with actionable error messages
 * - Progress reporting for long-running operations
 * - Integration-friendly for build systems and IDEs
 * 
 * Command Structure:
 *   cpu8bit-compiler [options] <input-file>
 * 
 * Options:
 *   -o, --output <file>     Output file path (default: input.bin)
 *   -f, --format <format>   Output format: bin|hex|map|asm
 *   -l, --language <lang>   Input language: auto|assembly|c
 *   -O, --optimize <level>  Optimization level: 0|1|2
 *   -v, --verbose          Enable verbose output
 *   -q, --quiet            Suppress non-error output
 *   -h, --help             Display help information
 *   --version              Display version information
 * 
 * Exit Codes:
 *   0: Successful compilation
 *   1: Compilation errors (syntax, semantic)
 *   2: File I/O errors
 *   3: Invalid command line arguments
 *   4: Internal compiler error
 * 
 * @fileoverview Professional CLI interface for compiler access
 * @author CPU-8Bit Compiler Team
 * @version 1.0.0
 */

import { Command } from 'commander';
import { CPU8BitCompiler } from './compiler';
import { HighLevelCompiler } from './languages/high-level-compiler';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

program
  .name('cpu8bit')
  .description('CPU 8-Bit Compiler - Compile assembly and high-level languages to binary')
  .version('1.0.0');

program
  .command('compile')
  .alias('c')
  .description('Compile a source file to binary')
  .argument('<input>', 'Input source file')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('-f, --format <format>', 'Output format (bin, hex, both)', 'bin')
  .option('-l, --language <lang>', 'Source language (asm, c)', 'auto')
  .option('-k, --keep-asm', 'Keep generated assembly file')
  .option('-v, --verbose', 'Verbose output')
  .action((input, options) => {
    compileFile(input, options);
  });

program
  .command('example')
  .description('Generate example source files')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('-l, --language <lang>', 'Language for examples (asm, c, all)', 'all')
  .action((options) => {
    generateExamples(options.output, options.language);
  });

async function compileFile(inputPath: string, options: any) {
  try {
    if (!fs.existsSync(inputPath)) {
      console.error(`Error: Input file '${inputPath}' not found`);
      process.exit(1);
    }

    const sourceCode = fs.readFileSync(inputPath, 'utf-8');
    const filename = path.parse(inputPath).name;
    const extension = path.parse(inputPath).ext.toLowerCase();

    // Determine language
    let language = options.language;
    if (language === 'auto') {
      switch (extension) {
        case '.s':
        case '.asm':
          language = 'asm';
          break;
        case '.c':
        case '.h':
          language = 'c';
          break;
        default:
          language = 'asm'; // Default to assembly
      }
    }

    let result: any;

    if (language === 'asm') {
      // Use original assembly compiler
      const compiler = new CPU8BitCompiler({
        outputFormat: options.format,
        outputDir: options.output,
        verbose: options.verbose
      });

      result = compiler.compile(sourceCode, filename);
    } else {
      // Use high-level compiler
      const compiler = new HighLevelCompiler({
        language: language,
        outputFormat: options.format,
        outputDir: options.output,
        verbose: options.verbose,
        keepAssembly: options.keepAsm
      });

      result = compiler.compile(sourceCode, filename);
    }

    if (result.success) {
      console.log('Compilation successful!');
      if (result.outputFiles.length > 0) {
        console.log('Generated files:');
        result.outputFiles.forEach((file: string) => console.log(`  ${file}`));
      }
    } else {
      console.error('Compilation failed:');
      result.errors.forEach((error: string) => console.error(`  ${error}`));
      process.exit(1);
    }

  } catch (error) {
    console.error(`Compilation error: ${error}`);
    process.exit(1);
  }
}

function generateExamples(outputDir: string, language: string) {
  const examples = [];

  // Assembly examples
  if (language === 'asm' || language === 'all') {
    examples.push(...[
      {
        filename: 'hello.s',
        content: `; Hello World Example for CPU 8-Bit
; This program outputs "Hello" to port 1

.ORG 0x00       ; Start at address 0

MAIN:
    LDI 72      ; Load 'H' (ASCII 72)
    OUT 1       ; Output to port 1
    
    LDI 101     ; Load 'e' (ASCII 101)
    OUT 1       ; Output to port 1
    
    LDI 108     ; Load 'l' (ASCII 108)
    OUT 1       ; Output to port 1
    OUT 1       ; Output 'l' again
    
    LDI 111     ; Load 'o' (ASCII 111)
    OUT 1       ; Output to port 1
    
    HLT         ; Halt the processor
`
      },
      {
        filename: 'counter.s',
        content: `; Counter Example for CPU 8-Bit
; Counts from 0 to 10 and outputs to port 0

.ORG 0x00

MAIN:
    LDI 0       ; Load immediate 0 into accumulator
    
LOOP:
    OUT 0       ; Output counter value to port 0
    ADI 1       ; Add 1 to accumulator
    
    ; Check if counter reached 11
    SUI 11      ; Subtract 11
    JZ END      ; Jump to END if zero (counter = 11)
    
    ADI 11      ; Add 11 back to restore counter
    JMP LOOP    ; Jump back to LOOP
    
END:
    HLT         ; Halt the processor
`
      }
    ]);
  }

  // C-like examples
  if (language === 'c' || language === 'all') {
    examples.push(...[
      {
        filename: 'hello.c',
        content: `// Hello World in C-like syntax
// Outputs "Hello" to port 1

void main() {
    output(1, 72);   // 'H'
    output(1, 101);  // 'e'
    output(1, 108);  // 'l'
    output(1, 108);  // 'l'
    output(1, 111);  // 'o'
    halt();
}
`
      },
      {
        filename: 'counter.c',
        content: `// Counter in C-like syntax
// Counts from 0 to 10

void main() {
    uint8 i;
    
    for (i = 0; i < 11; i = i + 1) {
        output(0, i);
    }
    
    halt();
}
`
      },
      {
        filename: 'calculator.c',
        content: `// Simple calculator in C-like syntax

uint8 add(uint8 a, uint8 b) {
    return a + b;
}

uint8 subtract(uint8 a, uint8 b) {
    return a - b;
}

void main() {
    uint8 num1 = input(0);  // Read from port 0
    uint8 num2 = input(1);  // Read from port 1
    uint8 op = input(2);    // Read operation from port 2
    
    uint8 result;
    
    if (op == 1) {
        result = add(num1, num2);
    } else if (op == 2) {
        result = subtract(num1, num2);
    } else {
        result = 0xFF;  // Error code
    }
    
    output(3, result);  // Output result to port 3
    halt();
}
`
      }
    ]);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Generating ${language} example files...`);
  examples.forEach(example => {
    const filePath = path.join(outputDir, example.filename);
    fs.writeFileSync(filePath, example.content);
    console.log(`  ${filePath}`);
  });

  console.log('\\nExample files generated successfully!');
  console.log('To compile examples:');
  
  if (language === 'asm' || language === 'all') {
    console.log(`  cpu8bit compile ${path.join(outputDir, 'hello.s')}`);
  }
  if (language === 'c' || language === 'all') {
    console.log(`  cpu8bit compile ${path.join(outputDir, 'hello.c')}`);
  }
}

program.parse();