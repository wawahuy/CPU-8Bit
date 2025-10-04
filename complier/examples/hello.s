; Hello World Example for CPU 8-Bit
; This program outputs "Hello" to port 1

.ORG 0x00       ; Start at address 0

MAIN:
    LDI 72      ; Load 'H' (ASCII 72)
    OUT 1       ; Output to port 1
    
    LDI 101     ; Load 'e' (ASCII 101)
    OUT 1       ; Output to port 1
    
    LDI 108     ; Load 'l' (ASCII 108)
    OUT 1       ; Output to port 1
    OUT 1       ; Output 'l' again
    
    LDI 111     ; Load 'o' (ASCII 111)
    OUT 1       ; Output to port 1
    
    HLT         ; Halt the processor
