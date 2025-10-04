/**
 * High-Level Language Compiler for 8-Bit CPU Architecture
 * 
 * Advanced compiler frontend for C-like languages targeting resource-constrained
 * 8-bit systems. Provides modern programming language features while generating
 * highly optimized assembly code.
 * 
 * Language Features Supported:
 * 
 * Type System:
 * - Primitive types: uint8, int8, bool, void
 * - Strong static typing with compile-time checking
 * - Automatic type promotion and safe casting
 * - Const-correctness for read-only variables
 * 
 * Control Structures:
 * - Conditional statements: if/else with expression evaluation
 * - Loops: while, for, do-while with break/continue
 * - Function calls with parameter passing
 * - Return statements with value propagation
 * 
 * Memory Management:
 * - Stack-based variable allocation
 * - Automatic scope management
 * - Zero-overhead abstractions where possible
 * - Memory-efficient code generation
 * 
 * Built-in Functions:
 * - Hardware I/O operations (read_port, write_port)
 * - System control (halt, delay)
 * - Debugging support (print, assert)
 * 
 * Compilation Pipeline:
 * 
 * 1. Lexical Analysis:
 *    - Unicode-aware tokenization
 *    - Preprocessor directive handling
 *    - Comment removal and whitespace normalization
 * 
 * 2. Syntax Analysis:
 *    - Recursive descent parsing with error recovery
 *    - AST construction with type annotation
 *    - Symbol table construction and scope resolution
 * 
 * 3. Semantic Analysis:
 *    - Type checking and inference
 *    - Dead code elimination
 *    - Constant folding and expression optimization
 * 
 * 4. Code Generation:
 *    - Register allocation for 8-bit architecture
 *    - Peephole optimization
 *    - Assembly code emission with debugging symbols
 * 
 * Optimization Strategies:
 * - Register reuse minimizing memory access
 * - Dead code elimination at multiple passes
 * - Constant propagation and folding
 * - Loop unrolling for small iteration counts
 * - Tail call optimization where applicable
 * 
 * Error Handling:
 * - Comprehensive error messages with source locations
 * - Suggestion system for common mistakes
 * - Multiple error reporting (don't stop at first error)
 * - Integration with IDE error highlighting
 * 
 * @fileoverview C-like language compiler with advanced optimization
 * @author CPU-8Bit Compiler Team
 * @version 1.0.0
 */

import { CTokenizer } from './c-tokenizer';
import { CParser } from './c-parser';
import { CToAssemblyGenerator } from './c-generator';
import { CPU8BitCompiler } from '../compiler';

export interface HighLevelCompilerOptions {
  language: 'c';
  outputFormat?: 'asm' | 'bin' | 'hex' | 'both';
  outputDir?: string;
  verbose?: boolean;
  keepAssembly?: boolean;
}

export interface HighLevelCompileResult {
  success: boolean;
  assembly?: string;
  binary?: Uint8Array;
  errors: string[];
  warnings: string[];
  outputFiles: string[];
}

export class HighLevelCompiler {
  private options: Required<HighLevelCompilerOptions>;

  constructor(options: HighLevelCompilerOptions) {
    this.options = {
      language: options.language,
      outputFormat: options.outputFormat || 'bin',
      outputDir: options.outputDir || '.',
      verbose: options.verbose || false,
      keepAssembly: options.keepAssembly || false
    };
  }

  compile(sourceCode: string, filename?: string): HighLevelCompileResult {
    const result: HighLevelCompileResult = {
      success: false,
      errors: [],
      warnings: [],
      outputFiles: []
    };

    try {
      // Step 1: Parse high-level language to AST
      let assembly: string;
      
      switch (this.options.language) {
        case 'c':
          assembly = this.compileCLike(sourceCode);
          break;
        default:
          throw new Error(`Unsupported language: ${this.options.language}`);
      }

      result.assembly = assembly;

      if (this.options.verbose) {
        console.log('Generated assembly code:');
        console.log(assembly);
        console.log('');
      }

      // Step 2: Compile assembly to binary if needed
      if (this.options.outputFormat !== 'asm') {
        const assemblyCompiler = new CPU8BitCompiler({
          outputFormat: this.options.outputFormat === 'both' ? 'both' : 
                       this.options.outputFormat === 'hex' ? 'hex' : 'bin',
          outputDir: this.options.outputDir,
          verbose: false // We handle verbosity ourselves
        });

        const assemblyResult = assemblyCompiler.compile(assembly, filename);
        
        if (!assemblyResult.success) {
          result.errors.push(...assemblyResult.errors.map(err => `Assembly compilation: ${err}`));
          return result;
        }

        result.binary = assemblyResult.binary;
        result.outputFiles.push(...assemblyResult.outputFiles);
      }

      // Save assembly file if requested or if output format is asm
      if (this.options.keepAssembly || this.options.outputFormat === 'asm') {
        if (filename) {
          const fs = require('fs');
          const path = require('path');
          
          const asmPath = path.join(this.options.outputDir, filename + '.s');
          fs.writeFileSync(asmPath, assembly);
          result.outputFiles.push(asmPath);
          
          if (this.options.verbose) {
            console.log(`Assembly saved to: ${asmPath}`);
          }
        }
      }

      result.success = true;
      return result;

    } catch (error) {
      result.errors.push(`Compilation failed: ${error}`);
      return result;
    }
  }

  private compileCLike(sourceCode: string): string {
    if (this.options.verbose) {
      console.log('Tokenizing C-like source...');
    }
    
    const tokenizer = new CTokenizer(sourceCode);
    const tokens = tokenizer.tokenize();

    if (this.options.verbose) {
      console.log('Parsing C-like tokens...');
    }

    const parser = new CParser(tokens);
    const parseResult = parser.parse();

    if (parseResult.errors.length > 0) {
      throw new Error(`Parse errors: ${parseResult.errors.join(', ')}`);
    }

    if (this.options.verbose) {
      console.log('Generating assembly from AST...');
    }

    const generator = new CToAssemblyGenerator();
    return generator.generate(parseResult.ast);
  }


}

// Factory function for easier usage
export function createHighLevelCompiler(language: 'c', options: Partial<HighLevelCompilerOptions> = {}): HighLevelCompiler {
  return new HighLevelCompiler({
    language,
    ...options
  });
}