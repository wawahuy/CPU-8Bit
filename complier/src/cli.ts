#!/usr/bin/env node

import { Command } from 'commander';
import { CPU8BitCompiler } from './compiler';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

program
  .name('cpu8bit')
  .description('CPU 8-Bit Compiler - Compile custom assembly language to binary')
  .version('1.0.0');

program
  .command('compile')
  .alias('c')
  .description('Compile a source file to binary')
  .argument('<input>', 'Input source file')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('-f, --format <format>', 'Output format (bin, hex, both)', 'bin')
  .option('-v, --verbose', 'Verbose output')
  .action((input, options) => {
    compileFile(input, options);
  });

program
  .command('example')
  .description('Generate example source files')
  .option('-o, --output <dir>', 'Output directory', '.')
  .action((options) => {
    generateExamples(options.output);
  });

async function compileFile(inputPath: string, options: any) {
  try {
    if (!fs.existsSync(inputPath)) {
      console.error(`Error: Input file '${inputPath}' not found`);
      process.exit(1);
    }

    const compiler = new CPU8BitCompiler({
      outputFormat: options.format,
      outputDir: options.output,
      verbose: options.verbose
    });

    const result = compiler.compileFile(inputPath);

    if (result.success) {
      console.log('Compilation successful!');
      if (result.outputFiles.length > 0) {
        console.log('Generated files:');
        result.outputFiles.forEach(file => console.log(`  ${file}`));
      }
    } else {
      console.error('Compilation failed:');
      result.errors.forEach(error => console.error(`  ${error}`));
      process.exit(1);
    }

  } catch (error) {
    console.error(`Compilation error: ${error}`);
    process.exit(1);
  }
}

function generateExamples(outputDir: string) {
  const examples = [
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
    },
    {
      filename: 'fibonacci.s',
      content: `; Fibonacci Sequence for CPU 8-Bit
; Calculates Fibonacci numbers and outputs them

.ORG 0x00

MAIN:
    LDI 0       ; First Fibonacci number (F0 = 0)
    STA 0x80    ; Store F0 at memory location 0x80
    OUT 0       ; Output F0
    
    LDI 1       ; Second Fibonacci number (F1 = 1)
    STA 0x81    ; Store F1 at memory location 0x81
    OUT 0       ; Output F1
    
    LDI 10      ; Counter for 10 Fibonacci numbers
    STA 0x82    ; Store counter
    
LOOP:
    LDA 0x80    ; Load F(n-2)
    ADD 0x81    ; Add F(n-1)
    OUT 0       ; Output F(n)
    
    ; Shift values: F(n-2) = F(n-1), F(n-1) = F(n)
    LDA 0x81    ; Load F(n-1)
    STA 0x80    ; Store as new F(n-2)
    
    LDA 0x80    ; Load F(n)
    ADD 0x81    ; Calculate F(n) again
    STA 0x81    ; Store as new F(n-1)
    
    ; Decrement counter
    LDA 0x82    ; Load counter
    SUI 1       ; Subtract 1
    STA 0x82    ; Store counter
    
    JNZ LOOP    ; Continue if counter != 0
    
    HLT         ; Halt
`
    }
  ];

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating example files...');
  examples.forEach(example => {
    const filePath = path.join(outputDir, example.filename);
    fs.writeFileSync(filePath, example.content);
    console.log(`  ${filePath}`);
  });

  console.log('\\nExample files generated successfully!');
  console.log('To compile an example:');
  console.log(`  cpu8bit compile ${path.join(outputDir, 'hello.s')}`);
}

program.parse();