/**
 * Token classification for assembly language elements
 * 
 * Each token type represents a distinct lexical category that the parser
 * can recognize and process appropriately.
 */
export enum TokenType {
  INSTRUCTION = 'INSTRUCTION',
  REGISTER = 'REGISTER',
  NUMBER = 'NUMBER',
  LABEL = 'LABEL',
  IDENTIFIER = 'IDENTIFIER',
  COMMA = 'COMMA',
  NEWLINE = 'NEWLINE',
  COMMENT = 'COMMENT',
  EOF = 'EOF',
  STRING = 'STRING',
  DIRECTIVE = 'DIRECTIVE',
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

/**
 * Finite state machine tokenizer for assembly language
 * 
 * Processes source code character by character, maintaining position tracking
 * for accurate error reporting. Implements lookahead for multi-character tokens.
 */
export class Tokenizer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  /**
   * Tokenizes the entire source code into a token stream
   * 
   * Uses a single-pass algorithm with character-by-character processing.
   * Automatically appends EOF token to mark end of input.
   * 
   * @returns Array of tokens in source order, terminated with EOF
   */
  tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (this.position < this.source.length) {
      this.skipWhitespace();
      
      if (this.position >= this.source.length) break;
      
      const token = this.nextToken();
      if (token) {
        tokens.push(token);
      }
    }
    
    tokens.push({
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column
    });
    
    return tokens;
  }

  private nextToken(): Token | null {
    const char = this.source[this.position];
    
    // Comments
    if (char === ';' || (char === '/' && this.peek() === '/')) {
      return this.readComment();
    }
    
    // Newlines
    if (char === '\n') {
      const token = this.createToken(TokenType.NEWLINE, char);
      this.advance();
      this.line++;
      this.column = 1;
      return token;
    }
    
    // Comma
    if (char === ',') {
      const token = this.createToken(TokenType.COMMA, char);
      this.advance();
      return token;
    }
    
    // String literals
    if (char === '"' || char === "'") {
      return this.readString();
    }
    
    // Numbers (hex, binary, decimal)
    if (this.isDigit(char) || (char === '0' && (this.peek() === 'x' || this.peek() === 'b'))) {
      return this.readNumber();
    }
    
    // Identifiers, instructions, registers, labels
    if (this.isAlpha(char) || char === '_' || char === '.') {
      return this.readIdentifier();
    }
    
    // Skip unknown characters
    this.advance();
    return null;
  }

  private readComment(): Token {
    const start = this.position;
    
    // Skip comment marker
    if (this.source[this.position] === ';') {
      this.advance();
    } else if (this.source[this.position] === '/' && this.peek() === '/') {
      this.advance();
      this.advance();
    }
    
    // Read until end of line
    while (this.position < this.source.length && this.source[this.position] !== '\n') {
      this.advance();
    }
    
    return this.createToken(TokenType.COMMENT, this.source.slice(start, this.position));
  }

  private readString(): Token {
    const quote = this.source[this.position];
    this.advance(); // Skip opening quote
    
    const start = this.position;
    
    while (this.position < this.source.length && this.source[this.position] !== quote) {
      if (this.source[this.position] === '\\') {
        this.advance(); // Skip escape character
      }
      this.advance();
    }
    
    const value = this.source.slice(start, this.position);
    
    if (this.position < this.source.length) {
      this.advance(); // Skip closing quote
    }
    
    return this.createToken(TokenType.STRING, value);
  }

  /**
   * Parses numeric literals with multiple base support
   * 
   * Supported formats:
   * - Decimal: 123, 255
   * - Hexadecimal: 0xFF, 0x2A (case insensitive)
   * - Binary: 0b11111111, 0b101010
   * 
   * @returns NUMBER token with the literal value
   */
  private readNumber(): Token {
    const start = this.position;
    
    // Hexadecimal
    if (this.source[this.position] === '0' && this.peek() === 'x') {
      this.advance(); // Skip '0'
      this.advance(); // Skip 'x'
      
      while (this.position < this.source.length && this.isHexDigit(this.source[this.position])) {
        this.advance();
      }
    }
    // Binary
    else if (this.source[this.position] === '0' && this.peek() === 'b') {
      this.advance(); // Skip '0'
      this.advance(); // Skip 'b'
      
      while (this.position < this.source.length && (this.source[this.position] === '0' || this.source[this.position] === '1')) {
        this.advance();
      }
    }
    // Decimal
    else {
      while (this.position < this.source.length && this.isDigit(this.source[this.position])) {
        this.advance();
      }
    }
    
    return this.createToken(TokenType.NUMBER, this.source.slice(start, this.position));
  }

  /**
   * Parses identifiers, keywords, and labels
   * 
   * Handles:
   * - Instruction mnemonics (converted to uppercase)
   * - Register names and variable identifiers
   * - Assembler directives (prefixed with '.')
   * - Labels (suffixed with ':')
   * 
   * @returns Appropriate token type based on content and context
   */
  private readIdentifier(): Token {
    const start = this.position;
    
    while (this.position < this.source.length && 
           (this.isAlphaNumeric(this.source[this.position]) || this.source[this.position] === '_')) {
      this.advance();
    }
    
    const value = this.source.slice(start, this.position).toUpperCase();
    
    // Check if it's a directive (starts with .)
    if (value.startsWith('.')) {
      return this.createToken(TokenType.DIRECTIVE, value);
    }
    
    // Check if it's a label (ends with :)
    if (this.position < this.source.length && this.source[this.position] === ':') {
      this.advance(); // Skip ':'
      return this.createToken(TokenType.LABEL, value);
    }
    
    return this.createToken(TokenType.IDENTIFIER, value);
  }

  private skipWhitespace(): void {
    while (this.position < this.source.length && 
           (this.source[this.position] === ' ' || this.source[this.position] === '\t' || this.source[this.position] === '\r')) {
      this.advance();
    }
  }

  private advance(): void {
    this.position++;
    this.column++;
  }

  private peek(): string {
    return this.position + 1 < this.source.length ? this.source[this.position + 1] : '';
  }

  private createToken(type: TokenType, value: string): Token {
    return {
      type,
      value,
      line: this.line,
      column: this.column - value.length
    };
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isHexDigit(char: string): boolean {
    return this.isDigit(char) || (char.toLowerCase() >= 'a' && char.toLowerCase() <= 'f');
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '.' || char === '_';
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }
}