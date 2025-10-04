/**
 * 8-Bit CPU Compiler - Main Entry Point
 * 
 * Central orchestration point for the complete compilation pipeline. This module
 * coordinates all compilation phases from source analysis to binary generation.
 * 
 * Architecture Overview:
 * ┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
 * │ Source Code │ -> │ Tokenization │ -> │   Parsing   │ -> │ Code Generation│
 * └─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
 *                                                                    │
 *                    ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
 *                    │  Binary     │ <- │ Optimization │ <- │ Assembly Code   │
 *                    │  Output     │    │  (Optional)  │    │ Generation      │
 *                    └─────────────┘    └──────────────┘    └─────────────────┘
 * 
 * Supported Input Languages:
 * - Assembly: Direct instruction mnemonics with labels and constants
 * - C-like: High-level language with variables, functions, and control flow
 * 
 * Output Formats:
 * - Binary (.bin): Raw machine code for direct CPU execution
 * - Intel HEX (.hex): Industry-standard hex format for programmers
 * - Memory Map (.map): Symbol and address mapping for debugging
 * - Assembly (.s): Generated assembly code for inspection
 * 
 * Error Handling:
 * - Comprehensive error reporting with source location tracking
 * - Recovery strategies for continued compilation after errors
 * - Detailed diagnostics for debugging compilation issues
 * 
 * @fileoverview Main compiler orchestration and public API
 * @author CPU-8Bit Compiler Team
 * @version 1.0.0
 */

import { Tokenizer } from './tokenizer';
import { Parser } from './parser';
import { generateBinary, CodeGenResult } from './code-generator';
import * as fs from 'fs';
import * as path from 'path';

export interface CompilerOptions {
  outputFormat?: 'bin' | 'hex' | 'both';
  outputDir?: string;
  verbose?: boolean;
}

export interface CompilerResult {
  success: boolean;
  binary?: Uint8Array;
  errors: string[];
  warnings: string[];
  outputFiles: string[];
}

export class CPU8BitCompiler {
  private options: Required<CompilerOptions>;

  constructor(options: CompilerOptions = {}) {
    this.options = {
      outputFormat: options.outputFormat || 'bin',
      outputDir: options.outputDir || '.',
      verbose: options.verbose || false
    };
  }

  compile(sourceCode: string, filename?: string): CompilerResult {
    const result: CompilerResult = {
      success: false,
      errors: [],
      warnings: [],
      outputFiles: []
    };

    try {
      // Step 1: Tokenize
      if (this.options.verbose) {
        console.log('Tokenizing source code...');
      }
      const tokenizer = new Tokenizer(sourceCode);
      const tokens = tokenizer.tokenize();

      // Step 2: Parse
      if (this.options.verbose) {
        console.log('Parsing tokens...');
      }
      const parser = new Parser(tokens);
      const parseResult = parser.parse();

      if (parseResult.errors.length > 0) {
        result.errors = parseResult.errors;
        return result;
      }

      // Step 3: Generate code
      if (this.options.verbose) {
        console.log('Generating machine code...');
      }
      const codeGenResult = generateBinary(parseResult);

      if (codeGenResult.errors.length > 0) {
        result.errors = codeGenResult.errors;
        return result;
      }

      result.binary = codeGenResult.binary;

      // Step 4: Write output files
      if (filename) {
        this.writeOutputFiles(filename, codeGenResult, result);
      }

      result.success = true;
      return result;

    } catch (error) {
      result.errors.push(`Compilation failed: ${error}`);
      return result;
    }
  }

  compileFile(inputPath: string): CompilerResult {
    try {
      const sourceCode = fs.readFileSync(inputPath, 'utf-8');
      const filename = path.parse(inputPath).name;
      return this.compile(sourceCode, filename);
    } catch (error) {
      return {
        success: false,
        errors: [`Failed to read file ${inputPath}: ${error}`],
        warnings: [],
        outputFiles: []
      };
    }
  }

  private writeOutputFiles(filename: string, codeGenResult: CodeGenResult, result: CompilerResult): void {
    const basePath = path.join(this.options.outputDir, filename);

    // Write binary file
    if (this.options.outputFormat === 'bin' || this.options.outputFormat === 'both') {
      const binPath = basePath + '.bin';
      fs.writeFileSync(binPath, codeGenResult.binary);
      result.outputFiles.push(binPath);
      if (this.options.verbose) {
        console.log(`Binary written to: ${binPath}`);
      }
    }

    // Write hex file
    if (this.options.outputFormat === 'hex' || this.options.outputFormat === 'both') {
      const hexPath = basePath + '.hex';
      const hexContent = this.generateIntelHex(codeGenResult.binary);
      fs.writeFileSync(hexPath, hexContent);
      result.outputFiles.push(hexPath);
      if (this.options.verbose) {
        console.log(`Hex file written to: ${hexPath}`);
      }
    }

    // Write map file (always generated for debugging)
    const mapPath = basePath + '.map';
    const mapContent = this.generateMapFile(codeGenResult);
    fs.writeFileSync(mapPath, mapContent);
    result.outputFiles.push(mapPath);
    if (this.options.verbose) {
      console.log(`Map file written to: ${mapPath}`);
    }
  }

  private generateIntelHex(binary: Uint8Array): string {
    const lines: string[] = [];
    const bytesPerLine = 16;

    for (let i = 0; i < binary.length; i += bytesPerLine) {
      const chunk = binary.slice(i, i + bytesPerLine);
      const address = i.toString(16).padStart(4, '0').toUpperCase();
      const dataLength = chunk.length.toString(16).padStart(2, '0').toUpperCase();
      
      let dataHex = '';
      let checksum = parseInt(dataLength, 16) + Math.floor(i / 256) + (i % 256);
      
      for (const byte of chunk) {
        dataHex += byte.toString(16).padStart(2, '0').toUpperCase();
        checksum += byte;
      }
      
      checksum = (256 - (checksum % 256)) % 256;
      const checksumHex = checksum.toString(16).padStart(2, '0').toUpperCase();
      
      lines.push(`:${dataLength}${address}00${dataHex}${checksumHex}`);
    }

    // End of file record
    lines.push(':00000001FF');
    
    return lines.join('\n') + '\n';
  }

  private generateMapFile(codeGenResult: CodeGenResult): string {
    const lines: string[] = [];
    lines.push('CPU 8-Bit Compiler - Memory Map');
    lines.push('================================');
    lines.push('');
    lines.push('Address  | Hex | Description');
    lines.push('---------|-----|------------');

    for (let i = 0; i < codeGenResult.binary.length; i++) {
      const address = i.toString().padStart(7, ' ');
      const hex = codeGenResult.binary[i].toString(16).padStart(2, '0').toUpperCase();
      const description = codeGenResult.map.get(i) || '';
      lines.push(`${address}  | ${hex}  | ${description}`);
    }

    return lines.join('\n') + '\n';
  }
}