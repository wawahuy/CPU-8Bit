# 8-Bit CPU Project

## Introduction

This project aims to design and build a complete 8-bit CPU from scratch using 74LS and 74HC family ICs. The project includes both hardware (electronic circuits) and software (assembler, simulator, sample programs), helping you understand computer architecture fundamentals, CPU operation principles, and programming at the lowest level.

## Project Objectives
- Design and assemble a functional 8-bit CPU from discrete logic ICs
- Build supporting software: assembler, simulator, and program loader
- Document every step in detail including circuit diagrams, source code, and user guides

## Architecture Overview
- **Data width:** 8-bit
- **Address width:** 8-bit (supports 256 memory locations)
- **Registers:** A, B, PC, IR, MAR, etc.
- **ALU:** Supports basic operations (Add, Subtract, AND, OR, NOT)
- **Control Unit:** ROM-based or discrete logic
- **Memory:** SRAM or EEPROM

## Hardware
The CPU is built from discrete logic ICs from the 74LS/74HC families, including:
- Logic gates (AND, OR, NOT, NAND, NOR, XOR)
- Registers (74LS173, 74LS273, ...)
- Counters (74LS161, 74LS163, ...)
- Decoders (74LS138, 74LS139, ...)
- Tri-state buffers (74LS245, 74LS244, ...)
- ALU (74LS181 or custom design)
- ROM/EPROM/EEPROM (microcode storage)
- SRAM (data memory)

### Main Components List
| IC Name      | Function                 | Quantity (Reference) |
|--------------|--------------------------|----------------------|
| 74LS173      | 4-bit Register           | 4                    |
| 74LS161      | 4-bit Counter            | 2                    |
| 74LS138      | 3-to-8 Decoder           | 1                    |
| 74LS245      | 8-bit Buffer             | 2                    |
| 74LS181      | 4-bit ALU                | 2                    |
| 74LS08       | AND Gate                 | 2                    |
| 74LS32       | OR Gate                  | 2                    |
| 74LS04       | NOT Gate                 | 1                    |
| 28C256       | ROM/EPROM 32KB           | 1                    |
| 62256        | SRAM 32KB                | 1                    |

## Software
- **Assembler:** Converts assembly language to machine code for the CPU
- **Simulator:** Simulates CPU operation on a computer
- **ROM Programmer:** Supports programming code into ROM/EPROM
- **Sample Programs:** Various sample programs demonstrating CPU operation

## Usage Guide
1. Assemble the circuit according to the schematic (refer to included schematic files)
2. Write assembly programs and compile using the assembler
3. Program the machine code into ROM/EPROM
4. Power up and run tests

## References
- 74LS/74HC IC Datasheets
- Computer Architecture Fundamentals

## Contact
For questions or contributions, please contact via GitHub or author's email.
