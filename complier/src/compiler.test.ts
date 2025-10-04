import { CPU8BitCompiler } from '../src/compiler';

describe('CPU8BitCompiler', () => {
  let compiler: CPU8BitCompiler;

  beforeEach(() => {
    compiler = new CPU8BitCompiler();
  });

  test('should compile simple LDI instruction', () => {
    const source = 'LDI 42';
    const result = compiler.compile(source);

    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.binary).toBeDefined();
    expect(result.binary![0]).toBe(0x13); // LDI opcode
    expect(result.binary![1]).toBe(42);   // Immediate value
  });

  test('should compile program with labels', () => {
    const source = `
      LDI 10
      LOOP:
        SUI 1
        JNZ LOOP
        HLT
    `;
    
    const result = compiler.compile(source);
    
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should handle syntax errors', () => {
    const source = 'INVALID_INSTRUCTION 42';
    const result = compiler.compile(source);

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('should compile arithmetic operations', () => {
    const source = `
      LDI 5
      ADI 10
      SUI 3
      HLT
    `;
    
    const result = compiler.compile(source);
    
    expect(result.success).toBe(true);
    expect(result.binary![0]).toBe(0x13); // LDI
    expect(result.binary![1]).toBe(5);
    expect(result.binary![2]).toBe(0x21); // ADI
    expect(result.binary![3]).toBe(10);
    expect(result.binary![4]).toBe(0x23); // SUI
    expect(result.binary![5]).toBe(3);
    expect(result.binary![6]).toBe(0xFF); // HLT
  });
});