import type {
	CodeStats,
	CodeValidationResult,
	FormattingOptions,
	LanguageConfig,
	SupportedLanguage,
} from "../types";

// Language configurations
export const languageConfigs: Record<SupportedLanguage, LanguageConfig> = {
	javascript: {
		name: "javascript",
		label: "JavaScript",
		extensions: [".js", ".mjs"],
		commentSyntax: { single: "//", multiStart: "/*", multiEnd: "*/" },
		supportsFormatting: true,
		supportsMinification: true,
	},
	typescript: {
		name: "typescript",
		label: "TypeScript",
		extensions: [".ts", ".tsx"],
		commentSyntax: { single: "//", multiStart: "/*", multiEnd: "*/" },
		supportsFormatting: true,
		supportsMinification: true,
	},
	python: {
		name: "python",
		label: "Python",
		extensions: [".py", ".pyw"],
		commentSyntax: { single: "#" },
		supportsFormatting: true,
		supportsMinification: false,
	},
	java: {
		name: "java",
		label: "Java",
		extensions: [".java"],
		commentSyntax: { single: "//", multiStart: "/*", multiEnd: "*/" },
		supportsFormatting: true,
		supportsMinification: false,
	},
	cpp: {
		name: "cpp",
		label: "C++",
		extensions: [".cpp", ".cc", ".cxx", ".h", ".hpp"],
		commentSyntax: { single: "//", multiStart: "/*", multiEnd: "*/" },
		supportsFormatting: true,
		supportsMinification: false,
	},
	csharp: {
		name: "csharp",
		label: "C#",
		extensions: [".cs"],
		commentSyntax: { single: "//", multiStart: "/*", multiEnd: "*/" },
		supportsFormatting: true,
		supportsMinification: false,
	},
	php: {
		name: "php",
		label: "PHP",
		extensions: [".php"],
		commentSyntax: { single: "//", multiStart: "/*", multiEnd: "*/" },
		supportsFormatting: true,
		supportsMinification: true,
	},
	ruby: {
		name: "ruby",
		label: "Ruby",
		extensions: [".rb"],
		commentSyntax: { single: "#" },
		supportsFormatting: true,
		supportsMinification: false,
	},
	go: {
		name: "go",
		label: "Go",
		extensions: [".go"],
		commentSyntax: { single: "//", multiStart: "/*", multiEnd: "*/" },
		supportsFormatting: true,
		supportsMinification: false,
	},
	rust: {
		name: "rust",
		label: "Rust",
		extensions: [".rs"],
		commentSyntax: { single: "//", multiStart: "/*", multiEnd: "*/" },
		supportsFormatting: true,
		supportsMinification: false,
	},
	html: {
		name: "html",
		label: "HTML",
		extensions: [".html", ".htm"],
		commentSyntax: { multiStart: "<!--", multiEnd: "-->" },
		supportsFormatting: true,
		supportsMinification: true,
	},
	css: {
		name: "css",
		label: "CSS",
		extensions: [".css"],
		commentSyntax: { multiStart: "/*", multiEnd: "*/" },
		supportsFormatting: true,
		supportsMinification: true,
	},
	scss: {
		name: "scss",
		label: "SCSS",
		extensions: [".scss"],
		commentSyntax: { single: "//", multiStart: "/*", multiEnd: "*/" },
		supportsFormatting: true,
		supportsMinification: true,
	},
	json: {
		name: "json",
		label: "JSON",
		extensions: [".json"],
		commentSyntax: {},
		supportsFormatting: true,
		supportsMinification: true,
	},
	xml: {
		name: "xml",
		label: "XML",
		extensions: [".xml"],
		commentSyntax: { multiStart: "<!--", multiEnd: "-->" },
		supportsFormatting: true,
		supportsMinification: true,
	},
	yaml: {
		name: "yaml",
		label: "YAML",
		extensions: [".yaml", ".yml"],
		commentSyntax: { single: "#" },
		supportsFormatting: true,
		supportsMinification: false,
	},
	sql: {
		name: "sql",
		label: "SQL",
		extensions: [".sql"],
		commentSyntax: { single: "--", multiStart: "/*", multiEnd: "*/" },
		supportsFormatting: true,
		supportsMinification: false,
	},
	markdown: {
		name: "markdown",
		label: "Markdown",
		extensions: [".md", ".markdown"],
		commentSyntax: { multiStart: "<!--", multiEnd: "-->" },
		supportsFormatting: true,
		supportsMinification: false,
	},
};

// Default formatting options
export const defaultFormattingOptions: FormattingOptions = {
	indentSize: 2,
	indentType: "spaces",
	maxLineLength: 80,
	insertFinalNewline: true,
	trimTrailingWhitespace: true,
	semicolons: true,
	singleQuotes: false,
	trailingCommas: true,
};

// Validation function
export function validateCode(
	code: string,
	language: SupportedLanguage,
): CodeValidationResult {
	if (!code.trim()) {
		return { isValid: true };
	}

	try {
		// Basic validation for specific languages
		switch (language) {
			case "json": {
				JSON.parse(code);
				break;
			}
			case "javascript":
			case "typescript": {
				// Basic syntax check for JS/TS
				const brackets = { "(": ")", "[": "]", "{": "}" };
				const stack: string[] = [];
				const lines = code.split("\n");

				for (let i = 0; i < lines.length; i++) {
					const line = lines[i];
					for (let j = 0; j < line.length; j++) {
						const char = line[j];
						if (char in brackets) {
							stack.push(brackets[char as keyof typeof brackets]);
						} else if (Object.values(brackets).includes(char)) {
							const expected = stack.pop();
							if (char !== expected) {
								return {
									isValid: false,
									error: `Mismatched bracket: expected '${expected}', found '${char}'`,
									lineNumber: i + 1,
									columnNumber: j + 1,
								};
							}
						}
					}
				}

				if (stack.length > 0) {
					return {
						isValid: false,
						error: `Unclosed bracket: expected '${stack[stack.length - 1]}'`,
					};
				}
				break;
			}
			default:
				// For other languages, just check for basic structure
				break;
		}

		return { isValid: true };
	} catch (error) {
		if (error instanceof SyntaxError) {
			return {
				isValid: false,
				error: error.message,
			};
		}

		return {
			isValid: false,
			error: "Invalid code format",
		};
	}
}

// Basic formatting function
export function formatCode(
	code: string,
	language: SupportedLanguage,
	options: FormattingOptions,
): string {
	if (!code.trim()) return code;

	const config = languageConfigs[language];
	if (!config.supportsFormatting) return code;

	try {
		switch (language) {
			case "json":
				return formatJson(code, options);
			case "html":
			case "xml":
				return formatMarkup(code, options);
			case "css":
			case "scss":
				return formatCss(code, options);
			default:
				return formatGeneric(code, options);
		}
	} catch {
		return code;
	}
}

// Minification function
export function minifyCode(
	code: string,
	language: SupportedLanguage,
): string {
	if (!code.trim()) return code;

	const config = languageConfigs[language];
	if (!config.supportsMinification) return code;

	try {
		switch (language) {
			case "json":
				return JSON.stringify(JSON.parse(code));
			case "html":
			case "xml":
				return minifyMarkup(code);
			case "css":
			case "scss":
				return minifyCss(code);
			case "javascript":
			case "typescript":
				return minifyJs(code);
			default:
				return code;
		}
	} catch {
		return code;
	}
}

// Calculate code statistics
export function calculateCodeStats(
	code: string,
	language: SupportedLanguage,
): CodeStats {
	const defaultStats: CodeStats = {
		size: 0,
		lines: 0,
		characters: 0,
		charactersNoSpaces: 0,
		words: 0,
		functions: 0,
		classes: 0,
		comments: 0,
	};

	if (!code.trim()) return defaultStats;

	const lines = code.split("\n");
	const config = languageConfigs[language];

	const stats: CodeStats = {
		size: new Blob([code]).size,
		lines: lines.length,
		characters: code.length,
		charactersNoSpaces: code.replace(/\s/g, "").length,
		words: code.split(/\s+/).filter(Boolean).length,
		functions: 0,
		classes: 0,
		comments: 0,
	};

	// Count functions, classes, and comments based on language
	switch (language) {
		case "javascript":
		case "typescript": {
			stats.functions = (code.match(/function\s+\w+|\w+\s*=>|\w+\s*:\s*function/g) || []).length;
			stats.classes = (code.match(/class\s+\w+/g) || []).length;
			stats.comments = (code.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length;
			break;
		}
		case "python": {
			stats.functions = (code.match(/def\s+\w+/g) || []).length;
			stats.classes = (code.match(/class\s+\w+/g) || []).length;
			stats.comments = (code.match(/#.*/g) || []).length;
			break;
		}
		case "java":
		case "csharp": {
			stats.functions = (code.match(/\b(public|private|protected|static)?\s*\w+\s+\w+\s*\(/g) || []).length;
			stats.classes = (code.match(/class\s+\w+/g) || []).length;
			stats.comments = (code.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length;
			break;
		}
		default: {
			// Generic comment counting
			if (config.commentSyntax.single) {
				const singleComments = code.match(new RegExp(`${config.commentSyntax.single.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`, 'g')) || [];
				stats.comments += singleComments.length;
			}
			if (config.commentSyntax.multiStart && config.commentSyntax.multiEnd) {
				const multiComments = code.match(new RegExp(`${config.commentSyntax.multiStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${config.commentSyntax.multiEnd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')) || [];
				stats.comments += multiComments.length;
			}
			break;
		}
	}

	return stats;
}

// Helper formatting functions
function formatJson(code: string, options: FormattingOptions): string {
	const parsed = JSON.parse(code);
	const indent = options.indentType === "tabs" ? "\t" : " ".repeat(options.indentSize);
	return JSON.stringify(parsed, null, indent);
}

function formatMarkup(code: string, options: FormattingOptions): string {
	// Basic HTML/XML formatting
	const indent = options.indentType === "tabs" ? "\t" : " ".repeat(options.indentSize);
	let formatted = code;
	let indentLevel = 0;

	// Remove extra whitespace
	formatted = formatted.replace(/\s+/g, " ").trim();

	// Add line breaks and indentation
	formatted = formatted.replace(/></g, ">\n<");
	const lines = formatted.split("\n");
	const result: string[] = [];

	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed.startsWith("</")) {
			indentLevel = Math.max(0, indentLevel - 1);
		}
		result.push(indent.repeat(indentLevel) + trimmed);
		if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.endsWith("/>")) {
			indentLevel++;
		}
	}

	return result.join("\n");
}

function formatCss(code: string, options: FormattingOptions): string {
	// Basic CSS formatting
	const indent = options.indentType === "tabs" ? "\t" : " ".repeat(options.indentSize);
	let formatted = code;

	// Remove extra whitespace
	formatted = formatted.replace(/\s+/g, " ").trim();

	// Add line breaks
	formatted = formatted.replace(/\{/g, " {\n");
	formatted = formatted.replace(/\}/g, "\n}\n");
	formatted = formatted.replace(/;/g, ";\n");

	const lines = formatted.split("\n");
	const result: string[] = [];
	let indentLevel = 0;

	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed === "}") {
			indentLevel = Math.max(0, indentLevel - 1);
		}
		if (trimmed) {
			result.push(indent.repeat(indentLevel) + trimmed);
		}
		if (trimmed.endsWith("{")) {
			indentLevel++;
		}
	}

	return result.join("\n");
}

function formatGeneric(code: string, options: FormattingOptions): string {
	// Generic formatting - mainly indentation and line cleanup
	const indent = options.indentType === "tabs" ? "\t" : " ".repeat(options.indentSize);
	const lines = code.split("\n");
	const result: string[] = [];
	let indentLevel = 0;

	for (const line of lines) {
		let trimmed = line.trim();
		
		if (options.trimTrailingWhitespace) {
			trimmed = trimmed.replace(/\s+$/, "");
		}

		// Adjust indentation based on brackets
		if (trimmed.includes("}") || trimmed.includes("])") || trimmed.includes(")}")) {
			indentLevel = Math.max(0, indentLevel - 1);
		}

		if (trimmed) {
			result.push(indent.repeat(indentLevel) + trimmed);
		}

		if (trimmed.includes("{") || trimmed.includes("[") || trimmed.includes("(")) {
			indentLevel++;
		}
	}

	let formatted = result.join("\n");
	
	if (options.insertFinalNewline && !formatted.endsWith("\n")) {
		formatted += "\n";
	}

	return formatted;
}

// Minification helpers
function minifyMarkup(code: string): string {
	return code
		.replace(/\s+/g, " ")
		.replace(/> </g, "><")
		.replace(/<!--[\s\S]*?-->/g, "")
		.trim();
}

function minifyCss(code: string): string {
	return code
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.replace(/\s+/g, " ")
		.replace(/; /g, ";")
		.replace(/ \{/g, "{")
		.replace(/\{ /g, "{")
		.replace(/ \}/g, "}")
		.trim();
}

function minifyJs(code: string): string {
	// Basic JS minification - remove comments and extra whitespace
	return code
		.replace(/\/\/.*$/gm, "")
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.replace(/\s+/g, " ")
		.replace(/; /g, ";")
		.replace(/ \{/g, "{")
		.replace(/\{ /g, "{")
		.replace(/ \}/g, "}")
		.trim();
}

// Auto-detect language from code content
export function detectLanguage(code: string): SupportedLanguage {
	if (!code.trim()) return "javascript";

	// JSON detection
	try {
		JSON.parse(code);
		return "json";
	} catch {
		// Not JSON, continue
	}

	// HTML detection
	if (/<\/?[a-z][\s\S]*>/i.test(code)) {
		return "html";
	}

	// CSS detection
	if (/[a-z-]+\s*:\s*[^;]+;/i.test(code) && /{[^}]*}/i.test(code)) {
		return "css";
	}

	// Python detection
	if (/def\s+\w+\s*\(|import\s+\w+|from\s+\w+\s+import/.test(code)) {
		return "python";
	}

	// Java detection
	if (/public\s+class\s+\w+|public\s+static\s+void\s+main/.test(code)) {
		return "java";
	}

	// C++ detection
	if (/#include\s*<[^>]+>|using\s+namespace\s+std/.test(code)) {
		return "cpp";
	}

	// TypeScript detection
	if (/interface\s+\w+|type\s+\w+\s*=|:\s*\w+\s*[=;]/.test(code)) {
		return "typescript";
	}

	// Default to JavaScript
	return "javascript";
}

// Get sample code for a language
export function getSampleCode(language: SupportedLanguage): string {
	const samples: Record<SupportedLanguage, string> = {
		javascript: `// JavaScript Example
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

const user = {
  name: "World",
  age: 25
};

greet(user.name);`,
		typescript: `// TypeScript Example
interface User {
  name: string;
  age: number;
}

function greet(user: User): void {
  console.log(\`Hello, \${user.name}!\`);
}

const user: User = {
  name: "World",
  age: 25
};

greet(user);`,
		python: `# Python Example
def greet(name):
    print(f"Hello, {name}!")

class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age

user = User("World", 25)
greet(user.name)`,
		java: `// Java Example
public class HelloWorld {
    public static void main(String[] args) {
        User user = new User("World", 25);
        greet(user.getName());
    }
    
    public static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }
}`,
		cpp: `// C++ Example
#include <iostream>
#include <string>

class User {
public:
    std::string name;
    int age;
    
    User(std::string n, int a) : name(n), age(a) {}
};

void greet(const std::string& name) {
    std::cout << "Hello, " << name << "!" << std::endl;
}

int main() {
    User user("World", 25);
    greet(user.name);
    return 0;
}`,
		csharp: `// C# Example
using System;

public class User
{
    public string Name { get; set; }
    public int Age { get; set; }
}

public class Program
{
    public static void Main()
    {
        var user = new User { Name = "World", Age = 25 };
        Greet(user.Name);
    }
    
    public static void Greet(string name)
    {
        Console.WriteLine($"Hello, {name}!");
    }
}`,
		php: `<?php
// PHP Example
class User {
    public $name;
    public $age;
    
    public function __construct($name, $age) {
        $this->name = $name;
        $this->age = $age;
    }
}

function greet($name) {
    echo "Hello, $name!\n";
}

$user = new User("World", 25);
greet($user->name);
?>`,
		ruby: `# Ruby Example
class User
  attr_accessor :name, :age
  
  def initialize(name, age)
    @name = name
    @age = age
  end
end

def greet(name)
  puts "Hello, #{name}!"
end

user = User.new("World", 25)
greet(user.name)`,
		go: `// Go Example
package main

import "fmt"

type User struct {
    Name string
    Age  int
}

func greet(name string) {
    fmt.Printf("Hello, %s!\n", name)
}

func main() {
    user := User{
        Name: "World",
        Age:  25,
    }
    greet(user.Name)
}`,
		rust: `// Rust Example
struct User {
    name: String,
    age: u32,
}

fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    let user = User {
        name: String::from("World"),
        age: 25,
    };
    greet(&user.name);
}`,
		html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    <div class="container">
        <h1>Hello, World!</h1>
        <p>Welcome to our website.</p>
        <button onclick="greet()">Click me</button>
    </div>
    
    <script>
        function greet() {
            alert('Hello, World!');
        }
    </script>
</body>
</html>`,
		css: `/* CSS Example */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  background-color: #333;
  color: white;
  padding: 1rem;
  border-radius: 8px;
}

.button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}`,
		scss: `// SCSS Example
$primary-color: #007bff;
$secondary-color: #6c757d;
$border-radius: 4px;

@mixin button-style($bg-color) {
  background-color: $bg-color;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: $border-radius;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: darken($bg-color, 10%);
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  .header {
    background-color: #333;
    color: white;
    padding: 1rem;
    border-radius: $border-radius;
  }
  
  .primary-button {
    @include button-style($primary-color);
  }
  
  .secondary-button {
    @include button-style($secondary-color);
  }
}`,
		json: `{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "isActive": true,
  "lastLogin": null
}`,
		xml: `<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user id="1">
    <name>John Doe</name>
    <age>30</age>
    <email>john.doe@example.com</email>
    <address>
      <street>123 Main St</street>
      <city>New York</city>
      <zipCode>10001</zipCode>
    </address>
    <hobbies>
      <hobby>reading</hobby>
      <hobby>swimming</hobby>
      <hobby>coding</hobby>
    </hobbies>
    <isActive>true</isActive>
  </user>
</users>`,
		yaml: `# YAML Example
user:
  name: John Doe
  age: 30
  email: john.doe@example.com
  address:
    street: 123 Main St
    city: New York
    zipCode: "10001"
  hobbies:
    - reading
    - swimming
    - coding
  isActive: true
  lastLogin: null

config:
  database:
    host: localhost
    port: 5432
    name: myapp
  cache:
    enabled: true
    ttl: 3600`,
		sql: `-- SQL Example
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER CHECK (age >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, age) VALUES
('John Doe', 'john.doe@example.com', 30),
('Jane Smith', 'jane.smith@example.com', 25),
('Bob Johnson', 'bob.johnson@example.com', 35);

SELECT 
    u.name,
    u.email,
    u.age,
    CASE 
        WHEN u.age < 25 THEN 'Young'
        WHEN u.age BETWEEN 25 AND 35 THEN 'Adult'
        ELSE 'Senior'
    END AS age_group
FROM users u
WHERE u.age >= 18
ORDER BY u.created_at DESC;`,
		markdown: `# Markdown Example

This is a **comprehensive** markdown document showcasing various features.

## Table of Contents

- [Headers](#headers)
- [Text Formatting](#text-formatting)
- [Lists](#lists)
- [Code](#code)
- [Links and Images](#links-and-images)

## Headers

### This is an H3
#### This is an H4
##### This is an H5

## Text Formatting

*Italic text* and **bold text** and ***bold italic text***.

~~Strikethrough text~~

> This is a blockquote.
> It can span multiple lines.

## Lists

### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item

## Code

Inline \`code\` example.

\`\`\`javascript
// Code block example
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

## Links and Images

[Link to Google](https://www.google.com)

![Alt text](https://via.placeholder.com/150)

## Table

| Name | Age | City |
|------|-----|------|
| John | 30  | NYC  |
| Jane | 25  | LA   |

---

*This is the end of the document.*`,
	};

	return samples[language] || samples.javascript;
}