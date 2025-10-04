# CPU 8-Bit Compiler

A TypeScript-based compiler for the custom 8-bit CPU assembly language. This tool compiles assembly code into binary machine code that can run on the 8-bit CPU hardware.

## Features

- **Custom Assembly Language**: Easy-to-learn syntax for 8-bit CPU programming
- **Multiple Output Formats**: Binary (.bin) and Intel HEX (.hex) formats
- **Comprehensive Instruction Set**: Data movement, arithmetic, logic, control flow, and I/O operations
- **Label Support**: Use labels for jumps and memory references
- **Assembler Directives**: .ORG, .DB, .DW for memory layout control
- **Error Reporting**: Detailed error messages with line numbers
- **Memory Map Generation**: Detailed .map files for debugging

## Installation

```bash
npm install
npm run build
```

## Usage

### Command Line Interface

```bash
# Compile a single file
cpu8bit compile program.s

# Specify output directory and format
cpu8bit compile program.s -o ./output -f both

# Generate example programs
cpu8bit example -o ./examples
```

### Programmatic API

```typescript
import { CPU8BitCompiler } from 'cpu8bit-compiler';

const compiler = new CPU8BitCompiler({
  outputFormat: 'bin',
  verbose: true
});

const result = compiler.compile(sourceCode);
if (result.success) {
  console.log('Compilation successful!');
} else {
  console.error('Errors:', result.errors);
}
```

## Assembly Language Syntax

### Instructions

#### Data Movement
- `MOV reg, reg` - Move data between registers
- `LDA addr` - Load accumulator from memory
- `STA addr` - Store accumulator to memory  
- `LDI value` - Load immediate value to accumulator

#### Arithmetic
- `ADD addr` - Add memory to accumulator
- `ADI value` - Add immediate to accumulator
- `SUB addr` - Subtract memory from accumulator
- `SUI value` - Subtract immediate from accumulator

#### Logical Operations
- `AND addr` - Logical AND with accumulator
- `ANI value` - Logical AND immediate
- `OR addr` - Logical OR with accumulator
- `ORI value` - Logical OR immediate
- `XOR addr` - Logical XOR with accumulator
- `XRI value` - Logical XOR immediate
- `NOT` - Logical NOT accumulator

#### Control Flow
- `JMP addr` - Jump to address
- `JZ addr` - Jump if zero flag set
- `JNZ addr` - Jump if zero flag clear
- `JC addr` - Jump if carry flag set
- `JNC addr` - Jump if carry flag clear
- `CALL addr` - Call subroutine
- `RET` - Return from subroutine

#### Stack Operations
- `PUSH` - Push accumulator to stack
- `POP` - Pop from stack to accumulator

#### I/O Operations
- `IN port` - Input from port
- `OUT port` - Output to port

#### Miscellaneous
- `NOP` - No operation
- `HLT` - Halt processor

### Registers
- `A` - Accumulator (primary register)
- `B` - General purpose register
- `PC` - Program Counter (read-only)
- `SP` - Stack Pointer

### Number Formats
- Decimal: `42`, `255`
- Hexadecimal: `0x2A`, `0xFF`
- Binary: `0b101010`, `0b11111111`

### Labels and Comments
```assembly
; This is a comment
MAIN:           ; Label definition
    LDI 10      ; Load 10 into accumulator
    JMP MAIN    ; Jump to MAIN label
```

### Assembler Directives
- `.ORG addr` - Set origin address
- `.DB value` - Define byte
- `.DW value` - Define word (2 bytes)

## Example Programs

### Hello World
```assembly
; Output "Hello" to port 1
.ORG 0x00

MAIN:
    LDI 72      ; 'H'
    OUT 1
    LDI 101     ; 'e'
    OUT 1
    LDI 108     ; 'l'
    OUT 1
    OUT 1       ; 'l' again
    LDI 111     ; 'o'
    OUT 1
    HLT
```

### Counter Loop
```assembly
; Count from 0 to 10
.ORG 0x00

MAIN:
    LDI 0       ; Initialize counter

LOOP:
    OUT 0       ; Output counter
    ADI 1       ; Increment
    SUI 11      ; Check if reached 11
    JZ END      ; Exit if done
    ADI 11      ; Restore counter
    JMP LOOP    ; Continue loop

END:
    HLT
```

## Output Files

### Binary File (.bin)
Raw binary machine code that can be loaded directly into CPU memory.

### Intel HEX File (.hex)
Standard Intel HEX format for programming ROM/EPROM devices.

### Map File (.map)
Human-readable memory map showing addresses, opcodes, and source line correspondence.

## Development

### Building
```bash
npm run build
```

### Testing
```bash
npm test
```

### Development Mode
```bash
npm run dev -- compile example.s
```

## Architecture

The compiler consists of several components:

1. **Tokenizer** - Lexical analysis of source code
2. **Parser** - Syntax analysis and AST generation
3. **Code Generator** - Binary machine code generation
4. **CLI** - Command-line interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.