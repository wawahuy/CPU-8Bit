/**
 * Abstract Syntax Tree (AST) Node Definitions for High-Level Languages
 * 
 * Defines a complete AST representation for C-like languages targeting
 * the 8-bit CPU architecture. The AST supports:
 * 
 * - Function declarations with typed parameters
 * - Variable declarations with explicit typing
 * - Control flow constructs (if/else, loops)
 * - Expression trees with operator precedence
 * - Built-in function calls for hardware interaction
 * 
 * Type System:
 * - uint8: 8-bit unsigned integer (0-255)
 * - int8: 8-bit signed integer (-128 to 127)  
 * - bool: Boolean values (0/1)
 * - void: No return value for functions
 * 
 * @fileoverview AST node definitions for C-like language compilation
 */

// Abstract Syntax Tree definitions for high-level languages

export enum NodeType {
  PROGRAM = 'PROGRAM',
  FUNCTION_DECLARATION = 'FUNCTION_DECLARATION',
  VARIABLE_DECLARATION = 'VARIABLE_DECLARATION',
  ASSIGNMENT = 'ASSIGNMENT',
  BINARY_EXPRESSION = 'BINARY_EXPRESSION',
  UNARY_EXPRESSION = 'UNARY_EXPRESSION',
  CALL_EXPRESSION = 'CALL_EXPRESSION',
  IDENTIFIER = 'IDENTIFIER',
  LITERAL = 'LITERAL',
  IF_STATEMENT = 'IF_STATEMENT',
  WHILE_LOOP = 'WHILE_LOOP',
  FOR_LOOP = 'FOR_LOOP',
  RETURN_STATEMENT = 'RETURN_STATEMENT',
  BLOCK_STATEMENT = 'BLOCK_STATEMENT',
  EXPRESSION_STATEMENT = 'EXPRESSION_STATEMENT'
}

export interface ASTNode {
  type: NodeType;
  line?: number;
  column?: number;
}

export interface Program extends ASTNode {
  type: NodeType.PROGRAM;
  body: Statement[];
}

export interface FunctionDeclaration extends ASTNode {
  type: NodeType.FUNCTION_DECLARATION;
  name: string;
  parameters: Parameter[];
  body: BlockStatement;
  returnType?: DataType;
}

export interface Parameter {
  name: string;
  type: DataType;
}

export interface VariableDeclaration extends ASTNode {
  type: NodeType.VARIABLE_DECLARATION;
  name: string;
  dataType: DataType;
  initializer?: Expression;
  isArray?: boolean;
  arraySize?: number;
}

export interface Assignment extends ASTNode {
  type: NodeType.ASSIGNMENT;
  left: Identifier;
  right: Expression;
  arrayIndex?: Expression;
}

export interface BinaryExpression extends ASTNode {
  type: NodeType.BINARY_EXPRESSION;
  left: Expression;
  operator: BinaryOperator;
  right: Expression;
}

export interface UnaryExpression extends ASTNode {
  type: NodeType.UNARY_EXPRESSION;
  operator: UnaryOperator;
  operand: Expression;
}

export interface CallExpression extends ASTNode {
  type: NodeType.CALL_EXPRESSION;
  callee: string;
  arguments: Expression[];
}

export interface Identifier extends ASTNode {
  type: NodeType.IDENTIFIER;
  name: string;
}

export interface Literal extends ASTNode {
  type: NodeType.LITERAL;
  value: number | string | boolean;
  dataType: DataType;
}

export interface IfStatement extends ASTNode {
  type: NodeType.IF_STATEMENT;
  condition: Expression;
  consequent: Statement;
  alternate?: Statement;
}

export interface WhileLoop extends ASTNode {
  type: NodeType.WHILE_LOOP;
  condition: Expression;
  body: Statement;
}

export interface ForLoop extends ASTNode {
  type: NodeType.FOR_LOOP;
  init?: VariableDeclaration | Assignment;
  condition?: Expression;
  update?: Assignment;
  body: Statement;
}

export interface ReturnStatement extends ASTNode {
  type: NodeType.RETURN_STATEMENT;
  value?: Expression;
}

export interface BlockStatement extends ASTNode {
  type: NodeType.BLOCK_STATEMENT;
  body: Statement[];
}

export interface ExpressionStatement extends ASTNode {
  type: NodeType.EXPRESSION_STATEMENT;
  expression: Expression;
}

// Type unions
export type Statement = 
  | FunctionDeclaration
  | VariableDeclaration
  | Assignment
  | IfStatement
  | WhileLoop
  | ForLoop
  | ReturnStatement
  | BlockStatement
  | ExpressionStatement;

export type Expression = 
  | BinaryExpression
  | UnaryExpression
  | CallExpression
  | Identifier
  | Literal;

// Data types
export enum DataType {
  UINT8 = 'uint8',    // 8-bit unsigned integer (0-255)
  INT8 = 'int8',      // 8-bit signed integer (-128 to 127)
  BOOL = 'bool',      // Boolean (0 or 1)
  VOID = 'void'       // For functions with no return value
}

// Operators
export enum BinaryOperator {
  ADD = '+',
  SUBTRACT = '-',
  AND = '&',
  OR = '|',
  XOR = '^',
  EQUAL = '==',
  NOT_EQUAL = '!=',
  LESS_THAN = '<',
  LESS_EQUAL = '<=',
  GREATER_THAN = '>',
  GREATER_EQUAL = '>='
}

export enum UnaryOperator {
  NOT = '!',
  BITWISE_NOT = '~',
  NEGATIVE = '-'
}

/**
 * Built-in function definitions for hardware interaction
 * 
 * These functions provide direct access to CPU hardware capabilities:
 * - I/O operations for peripheral communication
 * - System control functions (halt, delay)
 * - Hardware-specific operations not available in high-level constructs
 */
export interface BuiltinFunction {
  name: string;
  parameters: DataType[];
  returnType: DataType;
  description: string;
}

export const BUILTIN_FUNCTIONS: Record<string, BuiltinFunction> = {
  'input': {
    name: 'input',
    parameters: [DataType.UINT8],
    returnType: DataType.UINT8,
    description: 'Read input from specified port'
  },
  'output': {
    name: 'output',
    parameters: [DataType.UINT8, DataType.UINT8],
    returnType: DataType.VOID,
    description: 'Write value to specified port'
  },
  'delay': {
    name: 'delay',
    parameters: [DataType.UINT8],
    returnType: DataType.VOID,
    description: 'Delay execution for specified cycles'
  },
  'halt': {
    name: 'halt',
    parameters: [],
    returnType: DataType.VOID,
    description: 'Halt the processor'
  }
};