; Fibonacci Sequence for CPU 8-Bit
; Calculates Fibonacci numbers and outputs them

.ORG 0x00

MAIN:
    LDI 0       ; First Fibonacci number (F0 = 0)
    STA 0x80    ; Store F0 at memory location 0x80
    OUT 0       ; Output F0
    
    LDI 1       ; Second Fibonacci number (F1 = 1)
    STA 0x81    ; Store F1 at memory location 0x81
    OUT 0       ; Output F1
    
    LDI 10      ; Counter for 10 Fibonacci numbers
    STA 0x82    ; Store counter
    
LOOP:
    LDA 0x80    ; Load F(n-2)
    ADD 0x81    ; Add F(n-1)
    OUT 0       ; Output F(n)
    
    ; Shift values: F(n-2) = F(n-1), F(n-1) = F(n)
    LDA 0x81    ; Load F(n-1)
    STA 0x80    ; Store as new F(n-2)
    
    LDA 0x80    ; Load F(n)
    ADD 0x81    ; Calculate F(n) again
    STA 0x81    ; Store as new F(n-1)
    
    ; Decrement counter
    LDA 0x82    ; Load counter
    SUI 1       ; Subtract 1
    STA 0x82    ; Store counter
    
    JNZ LOOP    ; Continue if counter != 0
    
    HLT         ; Halt
