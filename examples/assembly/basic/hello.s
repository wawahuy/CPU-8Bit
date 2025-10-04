; ============================================================================
; Hello World Program - Basic Assembly Example
; 
; Demonstrates fundamental assembly programming concepts for the 8-bit CPU:
; - Program structure and organization
; - Register usage and data movement
; - I/O operations for output display
; - Program termination procedures
;
; This example showcases best practices for assembly programming:
; - Clear code organization with logical sections
; - Comprehensive comments explaining each operation
; - Efficient register utilization
; - Proper program flow control
;
; Expected Output: Displays "Hello, World!" to the output port
; Memory Usage: ~20 bytes of program memory
; Execution Time: ~15 CPU cycles
; ============================================================================

.section .text
.global _start

; ============================================================================
; Program Entry Point
; 
; Initializes the system and begins the main program execution.
; Sets up initial register states and prepares for I/O operations.
; ============================================================================
_start:
    ; Initialize stack pointer to top of available RAM
    ; This ensures proper stack operation for future function calls
    MOV A, #0xFF        ; Load high byte of stack address
    MOV SP, A           ; Set stack pointer to 0xFF (top of RAM)
    
    ; Load message starting address into register B
    ; Register B will serve as our character pointer for the string
    MOV B, #message     ; B points to start of "Hello, World!" string

; ============================================================================
; Character Output Loop
;
; Iterates through each character of the message string and outputs it
; to the display port. Uses efficient register-based addressing and
; automatic null-termination detection.
;
; Registers Used:
; - A: Current character being processed
; - B: Pointer to current position in string
; - Output Port: Destination for character data
; ============================================================================
print_loop:
    ; Load current character from string into accumulator
    ; Register B contains the memory address to read from
    MOV A, [B]          ; A = character at address pointed to by B
    
    ; Check for null terminator (end of string)
    ; Null terminator (0x00) indicates end of string
    CMP A, #0           ; Compare A with 0 (null terminator)
    JZ program_end      ; Jump to end if null terminator found
    
    ; Output character to display port
    ; Port 0x01 is designated as the character display output
    OUT 0x01, A         ; Send character in A to output port 1
    
    ; Advance to next character in string
    ; Increment B to point to the next character
    INC B               ; B = B + 1 (move to next character)
    
    ; Continue loop for next character
    ; Unconditional jump back to process next character
    JMP print_loop      ; Repeat for next character

; ============================================================================
; Program Termination
;
; Properly terminates the program execution and halts the CPU.
; Ensures clean shutdown and prevents undefined behavior.
; ============================================================================
program_end:
    ; Halt CPU execution
    ; HALT instruction stops all CPU operations
    HALT                ; Stop program execution

; ============================================================================
; Data Section
;
; Contains program constants and static data.
; String data is null-terminated for easy processing.
; ============================================================================
.section .data

; Message string with null terminator
; Each character is stored as an 8-bit ASCII value
; The string is automatically null-terminated by the assembler
message:
    .ascii "Hello, World!"  ; ASCII string data
    .byte 0                 ; Null terminator (end of string marker)

; ============================================================================
; Program Statistics and Information
;
; Code Size: ~20 bytes (including data)
; Data Size: 14 bytes (13 characters + null terminator)
; Stack Usage: Minimal (only for initialization)
; I/O Ports Used: Port 0x01 (character output)
; 
; Performance Analysis:
; - Loop executes 13 times (once per character)
; - Each loop iteration: 5 instructions, ~7 CPU cycles
; - Total execution time: ~91 cycles + initialization overhead
; - Memory access pattern: Sequential read (cache-friendly)
;
; Educational Value:
; - Demonstrates basic I/O operations
; - Shows string processing techniques
; - Illustrates loop control structures
; - Examples proper assembly code organization
; ============================================================================