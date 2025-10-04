// Simple calculator in C-like syntax

uint8 add(uint8 a, uint8 b) {
    return a + b;
}

uint8 subtract(uint8 a, uint8 b) {
    return a - b;
}

void main() {
    uint8 num1 = input(0);  // Read from port 0
    uint8 num2 = input(1);  // Read from port 1
    uint8 op = input(2);    // Read operation from port 2
    
    uint8 result;
    
    if (op == 1) {
        result = add(num1, num2);
    } else if (op == 2) {
        result = subtract(num1, num2);
    } else {
        result = 0xFF;  // Error code
    }
    
    output(3, result);  // Output result to port 3
    halt();
}
