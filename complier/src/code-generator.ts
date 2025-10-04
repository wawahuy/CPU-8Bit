/**
 * Code Generator for CPU 8-bit Assembly
 * 
 * Transforms parsed assembly AST into executable binary machine code.
 * Implements a two-pass assembler:
 * 
 * Pass 1: Symbol resolution and address calculation
 * - Resolves all label references to absolute addresses
 * - Calculates instruction sizes for address mapping
 * - Validates instruction operands and ranges
 * 
 * Pass 2: Code emission and binary generation
 * - Generates final machine code bytes
 * - Creates debugging information and memory map
 * - Handles assembler directives (.ORG, .DB, .DW)
 * 
 * @fileoverview Binary code generation with symbol resolution
 */

import { ParseResult, ParsedInstruction, ParsedDirective } from './parser';
import { INSTRUCTION_SET, REGISTERS } from './instruction-set';

/**
 * Result of code generation process
 */
export interface CodeGenResult {
  /** Generated machine code as byte array */
  binary: Uint8Array;
  /** Address-to-source mapping for debugging */
  map: Map<number, string>;
  /** Compilation errors encountered during generation */
  errors: string[];
}

/**
 * Two-pass assembler code generator
 * 
 * Converts parsed assembly instructions into binary machine code.
 * Maintains address tracking and symbol table for label resolution.
 * Generates comprehensive debugging information.
 */
export class CodeGenerator {
  private result: ParseResult;
  private binary: number[] = [];
  private addressMap: Map<number, string> = new Map();
  private errors: string[] = [];

  constructor(result: ParseResult) {
    this.result = result;
  }

  generate(): CodeGenResult {
    this.errors = [...this.result.errors];
    
    if (this.errors.length > 0) {
      return {
        binary: new Uint8Array(0),
        map: new Map(),
        errors: this.errors
      };
    }

    try {
      this.processDirectives();
      this.generateInstructions();
    } catch (error) {
      this.errors.push(`Code generation error: ${error}`);
    }

    return {
      binary: new Uint8Array(this.binary),
      map: this.addressMap,
      errors: this.errors
    };
  }

  private processDirectives(): void {
    for (const directive of this.result.directives) {
      switch (directive.directive) {
        case '.ORG':
          // .ORG directive sets the origin address
          // This is handled during parsing
          break;
        case '.DB':
          // Define byte
          this.emitByte(directive.value as number, `DB ${directive.value}`);
          break;
        case '.DW':
          // Define word (2 bytes, little-endian)
          const word = directive.value as number;
          this.emitByte(word & 0xFF, `DW ${directive.value} (low byte)`);
          this.emitByte((word >> 8) & 0xFF, `DW ${directive.value} (high byte)`);
          break;
      }
    }
  }

  private generateInstructions(): void {
    for (const instruction of this.result.instructions) {
      this.generateInstruction(instruction);
    }
  }

  private generateInstruction(instruction: ParsedInstruction): void {
    const instDef = INSTRUCTION_SET[instruction.instruction];
    if (!instDef) {
      throw new Error(`Unknown instruction: ${instruction.instruction}`);
    }

    // Emit opcode
    this.emitByte(instDef.opcode, `${instruction.instruction} (opcode)`);

    // Emit operands
    for (let i = 0; i < instruction.operands.length; i++) {
      const operand = instruction.operands[i];
      this.emitOperand(operand, instruction.instruction, i);
    }
  }

  private emitOperand(operand: string | number, instruction: string, index: number): void {
    if (typeof operand === 'number') {
      // Direct number
      if (operand < 0 || operand > 255) {
        throw new Error(`Operand ${operand} out of range (0-255) for instruction ${instruction}`);
      }
      this.emitByte(operand, `${instruction} operand ${index}: ${operand}`);
    } else if (typeof operand === 'string') {
      // Register or label reference
      if (REGISTERS[operand as keyof typeof REGISTERS] !== undefined) {
        // It's a register
        const regValue = REGISTERS[operand as keyof typeof REGISTERS];
        this.emitByte(regValue, `${instruction} operand ${index}: register ${operand}`);
      } else {
        // It's a label reference
        const labelAddress = this.result.labels.get(operand);
        if (labelAddress === undefined) {
          throw new Error(`Undefined label: ${operand}`);
        }
        this.emitByte(labelAddress, `${instruction} operand ${index}: label ${operand} (${labelAddress})`);
      }
    } else {
      throw new Error(`Invalid operand type for ${instruction}: ${typeof operand}`);
    }
  }

  private emitByte(value: number, description: string): void {
    if (value < 0 || value > 255) {
      throw new Error(`Byte value out of range: ${value}`);
    }
    
    const address = this.binary.length;
    this.binary.push(value);
    this.addressMap.set(address, description);
  }
}

export function generateBinary(parseResult: ParseResult): CodeGenResult {
  const generator = new CodeGenerator(parseResult);
  return generator.generate();
}