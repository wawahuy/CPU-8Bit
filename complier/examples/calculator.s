; Advanced Calculator Program for CPU 8-Bit
; Performs basic arithmetic operations
; Input: Two numbers from ports 0 and 1
; Output: Result to port 2

.ORG 0x00

MAIN:
    ; Read first number from port 0
    IN 0
    STA 0x80        ; Store first number at 0x80
    
    ; Read second number from port 1
    IN 1
    STA 0x81        ; Store second number at 0x81
    
    ; Read operation code from port 2
    ; 1 = ADD, 2 = SUB, 3 = AND, 4 = OR
    IN 2
    
    ; Check operation type
    SUI 1
    JZ DO_ADD
    
    SUI 1
    JZ DO_SUB
    
    SUI 1
    JZ DO_AND
    
    SUI 1
    JZ DO_OR
    
    ; Invalid operation
    LDI 0xFF
    OUT 2
    HLT

DO_ADD:
    LDA 0x80        ; Load first number
    ADD 0x81        ; Add second number
    JMP OUTPUT

DO_SUB:
    LDA 0x80        ; Load first number
    SUB 0x81        ; Subtract second number
    JMP OUTPUT

DO_AND:
    LDA 0x80        ; Load first number
    AND 0x81        ; AND with second number
    JMP OUTPUT

DO_OR:
    LDA 0x80        ; Load first number
    OR 0x81         ; OR with second number
    JMP OUTPUT

OUTPUT:
    OUT 2           ; Output result to port 2
    HLT             ; End program