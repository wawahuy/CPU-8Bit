export { CPU8BitCompiler } from './compiler';
export { Tokenizer, TokenType } from './tokenizer';
export { Parser } from './parser';
export { CodeGenerator, generateBinary } from './code-generator';
export { INSTRUCTION_SET, REGISTERS } from './instruction-set';

// High-level language support
export { HighLevelCompiler, createHighLevelCompiler } from './languages/high-level-compiler';
export { CTokenizer, CTokenType } from './languages/c-tokenizer';
export { CParser } from './languages/c-parser';
export { CToAssemblyGenerator } from './languages/c-generator';

// Re-export types
export type { CompilerOptions, CompilerResult } from './compiler';
export type { Token } from './tokenizer';
export type { ParseResult, ParsedInstruction, ParsedLabel, ParsedDirective } from './parser';
export type { CodeGenResult } from './code-generator';
export type { Instruction, RegisterName } from './instruction-set';

// High-level types
export type { HighLevelCompilerOptions, HighLevelCompileResult } from './languages/high-level-compiler';
export type { CToken } from './languages/c-tokenizer';
export type { CParseResult } from './languages/c-parser';
export type * from './languages/ast';