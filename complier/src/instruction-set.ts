/**
 * CPU 8-bit Instruction Set Architecture (ISA) Definition
 * 
 * Defines the complete instruction set for the custom 8-bit CPU including:
 * - Instruction opcodes and operand specifications
 * - Register definitions and addressing modes
 * - Instruction categories: data movement, arithmetic, logical, control flow
 * 
 * @fileoverview ISA specification for CPU 8-bit architecture
 * @version 1.0.0
 */
/**
 * Represents a single CPU instruction with its encoding and metadata
 */
export interface Instruction {
  /** Mnemonic name of the instruction */
  name: string;
  /** 8-bit opcode value (0x00-0xFF) */
  opcode: number;
  /** Number of operands this instruction expects (0-2) */
  operands: number;
  /** Human-readable description of instruction behavior */
  description: string;
}

/**
 * Complete instruction set for the 8-bit CPU
 * 
 * Opcode allocation:
 * - 0x00: NOP
 * - 0x10-0x1F: Data movement instructions
 * - 0x20-0x2F: Arithmetic operations
 * - 0x30-0x3F: Logical operations  
 * - 0x40-0x4F: Control flow instructions
 * - 0x50-0x5F: Stack operations
 * - 0x60-0x6F: I/O operations
 * - 0xFF: HALT
 */
export const INSTRUCTION_SET: Record<string, Instruction> = {
  // Data Movement
  'MOV': { name: 'MOV', opcode: 0x10, operands: 2, description: 'Move data from source to destination' },
  'LDA': { name: 'LDA', opcode: 0x11, operands: 1, description: 'Load accumulator from memory' },
  'STA': { name: 'STA', opcode: 0x12, operands: 1, description: 'Store accumulator to memory' },
  'LDI': { name: 'LDI', opcode: 0x13, operands: 1, description: 'Load immediate value to accumulator' },
  
  // Arithmetic Operations
  'ADD': { name: 'ADD', opcode: 0x20, operands: 1, description: 'Add memory to accumulator' },
  'ADI': { name: 'ADI', opcode: 0x21, operands: 1, description: 'Add immediate to accumulator' },
  'SUB': { name: 'SUB', opcode: 0x22, operands: 1, description: 'Subtract memory from accumulator' },
  'SUI': { name: 'SUI', opcode: 0x23, operands: 1, description: 'Subtract immediate from accumulator' },
  
  // Logical Operations
  'AND': { name: 'AND', opcode: 0x30, operands: 1, description: 'Logical AND with accumulator' },
  'ANI': { name: 'ANI', opcode: 0x31, operands: 1, description: 'Logical AND immediate with accumulator' },
  'OR':  { name: 'OR',  opcode: 0x32, operands: 1, description: 'Logical OR with accumulator' },
  'ORI': { name: 'ORI', opcode: 0x33, operands: 1, description: 'Logical OR immediate with accumulator' },
  'XOR': { name: 'XOR', opcode: 0x34, operands: 1, description: 'Logical XOR with accumulator' },
  'XRI': { name: 'XRI', opcode: 0x35, operands: 1, description: 'Logical XOR immediate with accumulator' },
  'NOT': { name: 'NOT', opcode: 0x36, operands: 0, description: 'Logical NOT accumulator' },
  
  // Control Flow
  'JMP': { name: 'JMP', opcode: 0x40, operands: 1, description: 'Jump to address' },
  'JZ':  { name: 'JZ',  opcode: 0x41, operands: 1, description: 'Jump if zero flag set' },
  'JNZ': { name: 'JNZ', opcode: 0x42, operands: 1, description: 'Jump if zero flag clear' },
  'JC':  { name: 'JC',  opcode: 0x43, operands: 1, description: 'Jump if carry flag set' },
  'JNC': { name: 'JNC', opcode: 0x44, operands: 1, description: 'Jump if carry flag clear' },
  'CALL': { name: 'CALL', opcode: 0x45, operands: 1, description: 'Call subroutine' },
  'RET': { name: 'RET', opcode: 0x46, operands: 0, description: 'Return from subroutine' },
  
  // Stack Operations
  'PUSH': { name: 'PUSH', opcode: 0x50, operands: 0, description: 'Push accumulator to stack' },
  'POP':  { name: 'POP',  opcode: 0x51, operands: 0, description: 'Pop from stack to accumulator' },
  
  // I/O Operations
  'IN':  { name: 'IN',  opcode: 0x60, operands: 1, description: 'Input from port' },
  'OUT': { name: 'OUT', opcode: 0x61, operands: 1, description: 'Output to port' },
  
  // Misc
  'NOP': { name: 'NOP', opcode: 0x00, operands: 0, description: 'No operation' },
  'HLT': { name: 'HLT', opcode: 0xFF, operands: 0, description: 'Halt processor' },
};

/**
 * CPU register definitions with their internal addresses
 * 
 * The CPU uses a register file with 4 addressable registers.
 * Register allocation follows common CPU conventions.
 */
export const REGISTERS = {
  'A': 0x00,  // Accumulator
  'B': 0x01,  // General purpose register
  'PC': 0x02, // Program Counter (read-only in most contexts)
  'SP': 0x03, // Stack Pointer
};

export type RegisterName = keyof typeof REGISTERS;