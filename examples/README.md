# Example Programs for 8-Bit CPU Compiler

Comprehensive collection of example programs demonstrating the capabilities
and features of the 8-bit CPU compiler. These examples serve multiple purposes:

## Learning Resources
- **Beginner Examples**: Simple programs for learning basic concepts
- **Intermediate Examples**: Real-world applications showing best practices
- **Advanced Examples**: Complex programs demonstrating optimization techniques

## Test Cases
- **Validation**: Programs used in automated testing
- **Benchmarks**: Performance measurement programs
- **Edge Cases**: Programs testing compiler limits and error handling

## Reference Implementations
- **Standard Algorithms**: Common algorithms optimized for 8-bit systems
- **Hardware Interfaces**: Examples of peripheral communication
- **System Programming**: Low-level system interaction examples

## Directory Structure

```
examples/
├── assembly/          # Pure assembly language examples
│   ├── basic/         # Simple instruction usage
│   ├── advanced/      # Complex assembly programs
│   └── hardware/      # Hardware-specific examples
├── c-like/           # High-level language examples
│   ├── algorithms/   # Data structures and algorithms
│   ├── applications/ # Complete application examples
│   └── tutorials/    # Step-by-step learning programs
└── mixed/            # Examples combining multiple languages
```

## Usage Guidelines

### Compilation
```bash
# Compile an assembly example
npm run compile examples/assembly/basic/hello.s

# Compile a C-like example
npm run compile examples/c-like/algorithms/sort.c

# Compile with optimization
npm run compile -- -O2 examples/c-like/applications/calculator.c
```

### Testing
```bash
# Run all example tests
npm run test:examples

# Test specific category
npm run test:examples -- --category=assembly
```

## Contributing Examples

When adding new examples:
1. Include comprehensive comments explaining the code
2. Add corresponding test cases
3. Update this README with program description
4. Follow the established coding style
5. Include expected output and performance characteristics

## Example Categories

### Assembly Language Examples

#### Basic Examples
- **hello.s**: Simple program demonstrating basic I/O
- **arithmetic.s**: Mathematical operations and register usage
- **loops.s**: Loop constructs and branching
- **functions.s**: Subroutine calls and stack management

#### Advanced Examples
- **interrupt.s**: Interrupt service routine implementation
- **dma.s**: Direct memory access programming
- **timer.s**: Hardware timer programming
- **serial.s**: Serial communication protocols

### C-Like Language Examples

#### Tutorial Programs
- **variables.c**: Variable declaration and basic types
- **functions.c**: Function definition and calling
- **control.c**: If statements and loops
- **operators.c**: All operator types and precedence

#### Algorithm Implementations
- **sort.c**: Bubble, insertion, and selection sort
- **search.c**: Linear and binary search algorithms
- **math.c**: Mathematical functions and calculations
- **string.c**: String manipulation utilities

#### Application Examples
- **calculator.c**: Simple arithmetic calculator
- **clock.c**: Digital clock with display
- **sensor.c**: Sensor data collection and processing
- **game.c**: Simple game implementation

## Performance Considerations

All examples are optimized for:
- **Memory Efficiency**: Minimal RAM usage
- **Code Size**: Compact instruction sequences
- **Execution Speed**: Fast execution cycles
- **Power Consumption**: Low-power operation modes

## Hardware Requirements

Examples are designed for:
- **CPU**: 8-bit architecture (74LS/74HC series)
- **Memory**: 64KB address space (32KB ROM, 32KB RAM)
- **I/O**: 16 digital I/O pins, 8 analog inputs
- **Clock**: 1-20 MHz operation