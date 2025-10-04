# CPU 8-Bit Compiler

A TypeScript-based compiler for the custom 8-bit CPU that supports multiple programming languages:
- **Assembly**: Native assembly language for direct hardware control
- **C-like**: High-level C-like syntax for easier programming

## Features

- **Multi-Language Support**: Assembly and C-like syntax
- **Transpilation Chain**: C-like → Assembly → Binary
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
./install.sh  # Install globally
```

## Usage

### Command Line Interface

```bash
# Compile assembly file
cpu8bit compile program.s

# Compile C-like file  
cpu8bit compile program.c

# Auto-detect language by extension
cpu8bit compile program.c -o ./output -f both -v

# Keep generated assembly file
cpu8bit compile program.c -k

# Generate examples for all languages
cpu8bit example -l all -o ./examples
```

### Programmatic API

```typescript
import { CPU8BitCompiler, HighLevelCompiler } from 'cpu8bit-compiler';

// For assembly
const assemblyCompiler = new CPU8BitCompiler({
  outputFormat: 'bin',
  verbose: true
});

// For high-level languages
const cCompiler = new HighLevelCompiler({
  language: 'c',
  outputFormat: 'both',
  keepAssembly: true
});

const result = cCompiler.compile(sourceCode);
if (result.success) {
  console.log('Compilation successful!');
} else {
  console.error('Errors:', result.errors);
}
```

## Language Support

### 1. Assembly Language

Native assembly with direct instruction mapping:

```assembly
; Hello World in Assembly
.ORG 0x00

MAIN:
    LDI 72      ; Load 'H'
    OUT 1       ; Output to port 1
    LDI 101     ; Load 'e' 
    OUT 1
    HLT         ; Halt
```

### 2. C-like Language

High-level C-like syntax with functions, variables, and control flow:

```c
// Hello World in C-like syntax
void main() {
    output(1, 72);   // 'H'
    output(1, 101);  // 'e'
    output(1, 108);  // 'l'
    output(1, 108);  // 'l'
    output(1, 111);  // 'o'
    halt();
}

// Calculator with functions
uint8 add(uint8 a, uint8 b) {
    return a + b;
}

void main() {
    uint8 x = 5;
    uint8 y = 10;
    uint8 result = add(x, y);
    output(1, result);
    halt();
}
```

#### C-like Language Features:
- **Data Types**: `uint8`, `int8`, `bool`, `void`
- **Variables**: Declaration with initialization
- **Functions**: Parameters, return values, local scope  
- **Control Flow**: `if/else`, `while`, `for` loops
- **Operators**: Arithmetic (`+`, `-`), logical (`&`, `|`, `^`, `!`), comparison (`==`, `!=`, `<`, `>`)
- **Built-in Functions**: `input(port)`, `output(port, value)`, `halt()`, `delay(cycles)`

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