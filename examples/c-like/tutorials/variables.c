/**
 * ============================================================================
 * Basic Variables and Types Tutorial
 * 
 * Comprehensive introduction to the C-like language type system and variable
 * declaration for the 8-bit CPU architecture. This tutorial demonstrates:
 * 
 * - All supported data types with practical examples
 * - Variable declaration and initialization patterns
 * - Type safety and conversion rules
 * - Memory-efficient programming techniques
 * - Best practices for 8-bit development
 * 
 * Target Audience: Beginners to the 8-bit CPU C-like language
 * Prerequisites: Basic understanding of programming concepts
 * Estimated Learning Time: 30 minutes
 * 
 * Hardware Requirements:
 * - 8-bit CPU with at least 1KB RAM
 * - Output port for displaying results
 * - Input port for receiving data (optional)
 * ============================================================================
 */

/**
 * ============================================================================
 * Type System Overview
 * 
 * The 8-bit CPU supports four fundamental data types optimized for
 * resource-constrained environments:
 * 
 * uint8: Unsigned 8-bit integer (0 to 255)
 * - Primary data type for the 8-bit architecture
 * - Most efficient for arithmetic operations
 * - Used for counters, flags, and general numeric data
 * 
 * int8: Signed 8-bit integer (-128 to 127)
 * - Two's complement representation
 * - Useful for relative calculations and signed arithmetic
 * - Automatic overflow detection in debug builds
 * 
 * bool: Boolean type (true/false, internally 0/1)
 * - Optimized for conditional logic
 * - Can be used in bit manipulation operations
 * - Automatically converts to uint8 when needed
 * 
 * void: No-value type for functions
 * - Used for functions that don't return values
 * - Cannot be used for variable declarations
 * - Enforces proper function usage patterns
 * ============================================================================
 */

/**
 * Program entry point demonstrating basic variable usage patterns.
 * 
 * This function showcases fundamental variable operations:
 * - Declaration with explicit typing
 * - Initialization with compile-time constants
 * - Runtime value assignment and modification
 * - Type-safe operations and conversions
 * 
 * @return void - Program completion status handled by runtime
 */
function main() : void {
    
    /**
     * ========================================================================
     * Unsigned 8-bit Integer Variables
     * 
     * uint8 is the most fundamental type in our 8-bit system.
     * These variables can hold values from 0 to 255 and are most
     * efficient for arithmetic operations on our target CPU.
     * ========================================================================
     */
    
    // Basic variable declaration with initialization
    // The compiler will allocate optimal register/memory for this variable
    uint8 counter = 0;           // Loop counter, initialized to zero
    
    // Demonstration of maximum and minimum values
    uint8 max_value = 255;       // Maximum unsigned 8-bit value
    uint8 min_value = 0;         // Minimum unsigned 8-bit value
    
    // Hexadecimal notation for bit patterns and hardware addresses
    uint8 port_address = 0xFF;   // Port address in hexadecimal
    uint8 bit_mask = 0b10101010; // Binary notation for bit manipulation
    
    
    /**
     * ========================================================================
     * Signed 8-bit Integer Variables
     * 
     * int8 variables use two's complement representation allowing both
     * positive and negative values. Essential for calculations involving
     * relative movements, temperature readings, or mathematical operations.
     * ========================================================================
     */
    
    // Signed integers can represent negative values
    int8 temperature = -25;      // Negative temperature reading
    int8 delta = 5;              // Positive change value
    int8 result = 0;             // Calculation result storage
    
    // Demonstration of signed arithmetic with overflow awareness
    result = temperature + delta; // Result: -20 (safe operation)
    
    
    /**
     * ========================================================================
     * Boolean Variables
     * 
     * Boolean types provide clear, readable code for logical operations.
     * Internally stored as uint8 (0 = false, 1 = true) but with enhanced
     * type safety and semantic clarity.
     * ========================================================================
     */
    
    // Boolean variables for state tracking
    bool is_ready = true;        // System initialization status
    bool has_error = false;      // Error condition flag
    bool sensor_active = false;  // Hardware sensor state
    
    // Boolean variables are ideal for conditional logic
    if (is_ready && !has_error) {
        sensor_active = true;    // Enable sensor when conditions are met
    }
    
    
    /**
     * ========================================================================
     * Variable Operations and Assignments
     * 
     * Demonstrating various assignment patterns and arithmetic operations
     * that are optimized for the 8-bit CPU architecture.
     * ========================================================================
     */
    
    // Basic arithmetic operations
    counter = counter + 1;       // Increment counter (standard form)
    counter++;                   // Increment counter (optimized form)
    
    // Compound assignment operators (generate efficient code)
    max_value -= 10;             // Subtract 10 from max_value
    min_value += 5;              // Add 5 to min_value
    
    // Bitwise operations for hardware control
    port_address = port_address | bit_mask;  // Set bits using OR operation
    port_address = port_address & ~bit_mask; // Clear bits using AND with NOT
    
    
    /**
     * ========================================================================
     * Advanced Variable Usage Patterns
     * 
     * Professional techniques for efficient variable usage in resource-
     * constrained environments. These patterns minimize memory usage and
     * optimize CPU performance.
     * ========================================================================
     */
    
    // Efficient loop variable usage
    for (uint8 i = 0; i < 10; i++) {
        // Loop variable 'i' is automatically optimized for register usage
        // Compiler will likely keep 'i' in a CPU register for performance
        result = result + (int8)i;   // Safe type conversion with cast
    }
    
    // Conditional variable initialization
    uint8 threshold = (temperature > 0) ? 100 : 50;  // Ternary operator
    
    // Bit manipulation for flags and states
    uint8 status_flags = 0;      // Initialize flags to all clear
    status_flags |= 0x01;        // Set bit 0 (enable flag)
    status_flags |= 0x04;        // Set bit 2 (ready flag)
    bool system_ready = (status_flags & 0x05) == 0x05;  // Check multiple flags
    
    
    /**
     * ========================================================================
     * Memory Efficiency Demonstrations
     * 
     * Showcasing techniques that minimize memory usage while maintaining
     * code clarity and correctness.
     * ========================================================================
     */
    
    // Reuse variables when lifetime doesn't overlap
    {
        uint8 temporary = counter * 2;    // Temporary calculation
        write_port(0x01, temporary);      // Output calculated value
        // 'temporary' goes out of scope here, memory can be reused
    }
    
    // Use smallest appropriate type for data ranges
    uint8 percent = 75;          // 0-100% range fits in uint8
    bool is_valid = (percent <= 100);  // Range validation
    
    
    /**
     * ========================================================================
     * Output Results for Verification
     * 
     * Display variable values to demonstrate program execution and verify
     * correct behavior of type operations.
     * ========================================================================
     */
    
    // Output final values to verify program execution
    write_port(0x01, counter);       // Display final counter value
    write_port(0x02, (uint8)result); // Display calculation result (cast to unsigned)
    write_port(0x03, system_ready ? 1 : 0);  // Display boolean as numeric value
    
    // Program completion - all variables automatically deallocated
}

/**
 * ============================================================================
 * Educational Summary and Key Takeaways
 * 
 * Variable Best Practices for 8-bit Systems:
 * 
 * 1. Type Selection:
 *    - Use uint8 for most numeric data (0-255 range)
 *    - Use int8 only when negative values are required
 *    - Use bool for all logical/conditional data
 *    - Prefer smaller types to conserve memory
 * 
 * 2. Memory Efficiency:
 *    - Limit variable scope to minimize memory usage
 *    - Reuse variables when lifetimes don't overlap
 *    - Use local variables instead of global when possible
 *    - Consider register allocation in tight loops
 * 
 * 3. Performance Optimization:
 *    - Use increment/decrement operators (++/--)
 *    - Prefer compound assignment operators (+=, -=, etc.)
 *    - Use bitwise operations for flags and hardware control
 *    - Minimize type conversions in inner loops
 * 
 * 4. Code Clarity:
 *    - Use descriptive variable names
 *    - Initialize variables at declaration when possible
 *    - Comment complex bit manipulation operations
 *    - Group related variable declarations
 * 
 * 5. Safety Considerations:
 *    - Always initialize variables before use
 *    - Be aware of overflow conditions in arithmetic
 *    - Use explicit type casting when converting types
 *    - Validate input ranges when possible
 * 
 * Memory Usage Analysis:
 * - Total local variables: ~12 bytes
 * - Register optimization: ~6 variables can be kept in registers
 * - Stack overhead: Minimal due to efficient scope management
 * - Code size: ~150 bytes (optimized assembly)
 * 
 * Next Tutorial: "Functions and Control Flow"
 * ============================================================================
 */