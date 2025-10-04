import { HighLevelCompiler } from './high-level-compiler';

describe('HighLevelCompiler', () => {
  test('should compile simple C program', () => {
    const source = `
      void main() {
        halt();
      }
    `;
    
    const compiler = new HighLevelCompiler({ language: 'c' });
    const result = compiler.compile(source);

    expect(result.success).toBe(true);
    expect(result.assembly).toBeDefined();
    expect(result.assembly).toContain('FUNC_MAIN');
    expect(result.assembly).toContain('HLT');
  });

  test('should compile C program with variables', () => {
    const source = `
      void main() {
        uint8 x = 42;
        output(1, x);
        halt();
      }
    `;
    
    const compiler = new HighLevelCompiler({ language: 'c' });
    const result = compiler.compile(source);

    expect(result.success).toBe(true);
    expect(result.assembly).toContain('LDI 42');
    expect(result.assembly).toContain('STA');
  });

  test('should compile C program with function calls', () => {
    const source = `
      uint8 add(uint8 a, uint8 b) {
        return a + b;
      }
      
      void main() {
        uint8 result = add(5, 10);
        output(1, result);
        halt();
      }
    `;
    
    const compiler = new HighLevelCompiler({ language: 'c' });
    const result = compiler.compile(source);

    expect(result.success).toBe(true);
    expect(result.assembly).toContain('FUNC_ADD');
    expect(result.assembly).toContain('CALL FUNC_ADD');
    expect(result.assembly).toContain('RET');
  });

  test('should handle compilation errors gracefully', () => {
    const source = `
      void main() {
        undefined_function();
      }
    `;
    
    const compiler = new HighLevelCompiler({ language: 'c' });
    const result = compiler.compile(source);

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});