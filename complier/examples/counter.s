; Counter Example for CPU 8-Bit
; Counts from 0 to 10 and outputs to port 0

.ORG 0x00

MAIN:
    LDI 0       ; Load immediate 0 into accumulator
    
LOOP:
    OUT 0       ; Output counter value to port 0
    ADI 1       ; Add 1 to accumulator
    
    ; Check if counter reached 11
    SUI 11      ; Subtract 11
    JZ END      ; Jump to END if zero (counter = 11)
    
    ADI 11      ; Add 11 back to restore counter
    JMP LOOP    ; Jump back to LOOP
    
END:
    HLT         ; Halt the processor
