import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';
import './App.css';

const languageMap = {
  javascript: 'javascript',
  python: 'python3',
  java: 'java',
  php: 'php',
  csharp: 'csharp',
  cpp: 'cpp',
  c: 'c',
  ruby: 'ruby',
  go: 'go',
  rust: 'rust',
  swift: 'swift',
  typescript: 'typescript',
};

const defaultCode = {
  javascript: '// JavaScript Example\nconsole.log("Hello, World!");',
  python: 'print("Hello, World!")',
  java: 'public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
  php: '<?php\necho "Hello, World!";\n?>',
  csharp: 'using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, World!");\n  }\n}',
  cpp: '#include <iostream>\nint main() {\n  std::cout << "Hello, World!";\n  return 0;\n}',
  c: '#include <stdio.h>\nint main() {\n  printf("Hello, World!");\n  return 0;\n}',
  ruby: 'puts "Hello, World!"',
  go: 'package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello, World!")\n}',
  rust: 'fn main() {\n  println!("Hello, World!");\n}',
  swift: 'print("Hello, World!")',
  typescript: 'console.log("Hello, World!");',
};

function App() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCode['javascript']);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    setCode(defaultCode[selectedLanguage] || '// Start coding...');
    setOutput('');
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const runCode = async () => {
    if (language === 'javascript') {
      try {
        setLoading(true);
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
          language: 'javascript', 
          version: '*', 
          files: [
            {
              name: 'Main.js', 
              content: code,
            },
          ],
        });
        console.log('response: ', response);
        const output = response.data.run?.output || 'No output';
        setLoading(false);
        setOutput(output);
      } catch (err) {
        setOutput('Error: ' + err.message);
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
          language: languageMap[language] || language,
          version: '*',
          files: [
            {
              name: `Main.${language}`,
              content: code,
            },
          ],
        });
  
        console.log('response: ', response);
        setOutput(response.data.run?.output || 'No output');
        setLoading(false);
      } catch (error) {
        setOutput('Error executing code: ' + error.message);
        setLoading(false);
      }
    }
  };
  

  return (
    <div className="app-container">
      <h2 className="heading">Monaco Code Editor</h2>

      <div className="language-selector-container">
        <label htmlFor="language-selector" className="language-selector-label">
          Select Language:
        </label>
        <select
          id="language-selector"
          value={language}
          onChange={handleLanguageChange}
          className="language-selector"
        >
          {Object.keys(languageMap).map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="editor-container">
        <MonacoEditor
          width="100%"
          height="400"
          language={language}
          theme="vs-light"
          value={code}
          onChange={handleCodeChange}
          options={{
            selectOnLineNumbers: true,
            fontSize: 16,
            automaticLayout: true,
          }}
        />
      </div>

      <button className="run-button" onClick={runCode}>
          {loading ? "Loading..." : "Run Code"}
      </button>

      <div className="output-container">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default App;
