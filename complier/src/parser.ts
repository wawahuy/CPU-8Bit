/**
 * Recursive Descent Parser for CPU 8-bit Assembly Language
 * 
 * Implements a top-down parser that builds an Abstract Syntax Tree (AST)
 * from the token stream. Features:
 * - Syntax error recovery with synchronization
 * - Two-pass parsing for forward label references
 * - Address calculation for instruction sizing
 * - Comprehensive error reporting with line numbers
 * 
 * Grammar:
 * Program ::= Statement*
 * Statement ::= Label | Directive | Instruction | Comment
 * Instruction ::= Mnemonic Operand* 
 * 
 * @fileoverview Assembly language parser with error recovery
 */

import { Token, TokenType } from './tokenizer';
import { INSTRUCTION_SET, REGISTERS } from './instruction-set';

/**
 * Parsed instruction with resolved operands
 */
export interface ParsedInstruction {
  /** Instruction mnemonic (e.g., 'LDA', 'JMP') */
  instruction: string;
  /** Operand values: immediates (numbers) or symbol references (strings) */
  operands: (string | number)[];
  /** Source line number for error reporting */
  line: number;
}

/**
 * Label definition with its target address
 */
export interface ParsedLabel {
  /** Label identifier */
  name: string;
  /** Source line number where label is defined */
  line: number;
}

/**
 * Assembler directive with its argument
 */
export interface ParsedDirective {
  /** Directive name (e.g., '.ORG', '.DB') */
  directive: string;
  /** Directive argument (address, data value, etc.) */
  value: string | number;
  /** Source line number for error reporting */
  line: number;
}

export interface ParseResult {
  instructions: ParsedInstruction[];
  labels: Map<string, number>; // label name -> instruction address
  directives: ParsedDirective[];
  errors: string[];
}

/**
 * Recursive descent parser with error recovery
 * 
 * Maintains parsing state including current position and address tracking.
 * Implements panic-mode error recovery by synchronizing on statement boundaries.
 */
export class Parser {
  private tokens: Token[];
  private position: number = 0;
  private currentAddress: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): ParseResult {
    const result: ParseResult = {
      instructions: [],
      labels: new Map(),
      directives: [],
      errors: []
    };

    while (!this.isAtEnd()) {
      try {
        this.parseStatement(result);
      } catch (error) {
        result.errors.push(`Line ${this.current().line}: ${error}`);
        this.synchronize();
      }
    }

    return result;
  }

  private parseStatement(result: ParseResult): void {
    this.skipNewlines();
    
    if (this.isAtEnd()) return;

    const token = this.current();

    switch (token.type) {
      case TokenType.LABEL:
        this.parseLabel(result);
        break;
      case TokenType.DIRECTIVE:
        this.parseDirective(result);
        break;
      case TokenType.IDENTIFIER:
        this.parseInstruction(result);
        break;
      case TokenType.COMMENT:
        this.advance(); // Skip comments
        break;
      default:
        throw new Error(`Unexpected token: ${token.value}`);
    }

    this.skipNewlines();
  }

  private parseLabel(result: ParseResult): void {
    const labelToken = this.advance();
    const labelName = labelToken.value;

    if (result.labels.has(labelName)) {
      throw new Error(`Label '${labelName}' already defined`);
    }

    result.labels.set(labelName, this.currentAddress);
  }

  private parseDirective(result: ParseResult): void {
    const directiveToken = this.advance();
    const directive = directiveToken.value;

    switch (directive) {
      case '.ORG':
        const orgValue = this.parseNumber();
        this.currentAddress = orgValue;
        result.directives.push({
          directive,
          value: orgValue,
          line: directiveToken.line
        });
        break;
      case '.DB':
        const dbValue = this.parseNumber();
        result.directives.push({
          directive,
          value: dbValue,
          line: directiveToken.line
        });
        this.currentAddress++;
        break;
      case '.DW':
        const dwValue = this.parseNumber();
        result.directives.push({
          directive,
          value: dwValue,
          line: directiveToken.line
        });
        this.currentAddress += 2;
        break;
      default:
        throw new Error(`Unknown directive: ${directive}`);
    }
  }

  private parseInstruction(result: ParseResult): void {
    const instructionToken = this.advance();
    const instructionName = instructionToken.value;

    if (!INSTRUCTION_SET[instructionName]) {
      throw new Error(`Unknown instruction: ${instructionName}`);
    }

    const instruction = INSTRUCTION_SET[instructionName];
    const operands: (string | number)[] = [];

    // Parse operands
    for (let i = 0; i < instruction.operands; i++) {
      if (i > 0) {
        if (!this.check(TokenType.COMMA)) {
          throw new Error(`Expected comma after operand ${i}`);
        }
        this.advance(); // Skip comma
      }

      operands.push(this.parseOperand());
    }

    result.instructions.push({
      instruction: instructionName,
      operands,
      line: instructionToken.line
    });

    // Calculate instruction size for address tracking
    this.currentAddress += 1 + instruction.operands;
  }

  private parseOperand(): string | number {
    const token = this.current();

    switch (token.type) {
      case TokenType.NUMBER:
        return this.parseNumber();
      case TokenType.IDENTIFIER:
        const identifier = this.advance().value;
        // Check if it's a register
        if (REGISTERS[identifier as keyof typeof REGISTERS] !== undefined) {
          return identifier;
        }
        // Otherwise it's a label reference
        return identifier;
      case TokenType.STRING:
        return this.advance().value;
      default:
        throw new Error(`Expected operand, got ${token.type}`);
    }
  }

  private parseNumber(): number {
    const token = this.advance();
    const value = token.value;

    if (value.startsWith('0x')) {
      return parseInt(value, 16);
    } else if (value.startsWith('0b')) {
      return parseInt(value.slice(2), 2);
    } else {
      return parseInt(value, 10);
    }
  }

  private skipNewlines(): void {
    while (this.check(TokenType.NEWLINE) || this.check(TokenType.COMMENT)) {
      this.advance();
    }
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.NEWLINE) return;

      switch (this.current().type) {
        case TokenType.LABEL:
        case TokenType.DIRECTIVE:
        case TokenType.IDENTIFIER:
          return;
      }

      this.advance();
    }
  }

  private isAtEnd(): boolean {
    return this.current().type === TokenType.EOF;
  }

  private current(): Token {
    return this.tokens[this.position];
  }

  private previous(): Token {
    return this.tokens[this.position - 1];
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.position++;
    return this.previous();
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.current().type === type;
  }
}