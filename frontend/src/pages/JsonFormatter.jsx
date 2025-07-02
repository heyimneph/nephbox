import React, { useState, useEffect, useRef } from 'react';
import styles from './JsonFormatter.module.css';
import Button from '../components/Button';
import PageWrapper from '../components/PageWrapper';
import PageTitle from '../components/PageTitle';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Ajv from 'ajv';

const DEFAULT_SCHEMA = `{
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "age": { "type": "number", "minimum": 0 }
  }
}`;

export default function JsonFormatter() {
    const [input, setInput] = useState('');
    const [schema, setSchema] = useState('');
    const [output, setOutput] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'error' or 'success'
    const [validationErrors, setValidationErrors] = useState([]);
    const [autoFormat, setAutoFormat] = useState(false);

    const dropRef = useRef(null);
    const schemaDropRef = useRef(null);

    const handleFormat = () => {
        setMessage('');
        setOutput('');
        setValidationErrors([]);
        setMessageType('');

        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            setOutput(formatted);
        } catch (err) {
            setMessage('Invalid JSON: ' + err.message);
            setMessageType('error');
        }
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setMessage('');
        setSchema('');
        setValidationErrors([]);
        setMessageType('');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
    };

    const handleDownload = () => {
        const blob = new Blob([output], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSchemaValidate = () => {
        setValidationErrors([]);
        setMessage('');
        setMessageType('');
        if (!schema.trim()) {
            try {
                JSON.parse(input);
                setMessage('Valid JSON!');
                setMessageType('success');
            } catch (err) {
                setMessage('Invalid JSON: ' + err.message);
                setMessageType('error');
            }
            return;
        }
        try {
            const parsedData = JSON.parse(input);
            const parsedSchema = JSON.parse(schema);
            const ajv = new Ajv({ allErrors: true });
            const validate = ajv.compile(parsedSchema);

            const valid = validate(parsedData);
            if (!valid && validate.errors) {
                setValidationErrors(validate.errors);
                setMessage('');
                setMessageType('');
            } else {
                setValidationErrors([]);
                setMessage('Valid JSON and matches schema!');
                setMessageType('success');
            }
        } catch (err) {
            setMessage('Validation Error: ' + err.message);
            setMessageType('error');
        }
    };

    const readFile = (file, setter) => {
        const reader = new FileReader();
        reader.onload = (event) => setter(event.target.result);
        reader.readAsText(file);
    };

    const handleDrop = (e, setter) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) readFile(file, setter);
    };

    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    useEffect(() => {
        if (autoFormat) {
            try {
                const parsed = JSON.parse(input);
                setOutput(JSON.stringify(parsed, null, 2));
                setMessage('');
                setMessageType('');
            } catch {
                setOutput('');
            }
        }
    }, [input, autoFormat]);

    const theme = document.documentElement.getAttribute('data-theme') === 'light' ? oneLight : oneDark;

    return (
        <PageWrapper>
            <PageTitle>JSON Formatter</PageTitle>
            <div className={styles.container}>

                <div
                    className={styles.dropZone}
                    onDrop={(e) => handleDrop(e, setInput)}
                    onDragOver={preventDefaults}
                    ref={dropRef}
                >
                    <p>Drag & Drop JSON file here or paste below:</p>
                </div>
                <textarea
                    placeholder="Paste your raw JSON here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={styles.input}
                />

                <div
                    className={styles.dropZone}
                    onDrop={(e) => handleDrop(e, setSchema)}
                    onDragOver={preventDefaults}
                    ref={schemaDropRef}
                >
                    <p>Drag & Drop Schema file here or create your own:</p>
                </div>
                <textarea
                    placeholder={DEFAULT_SCHEMA}
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                    className={styles.input}
                />

                <div className={styles.controls}>
                    <Button onClick={handleFormat} variant="primary">Format</Button>
                    <Button onClick={handleSchemaValidate} variant="secondary">Validate</Button>
                    <Button onClick={handleClear} variant="secondary">Clear</Button>
                    <label className={styles.toggle}>
                        <input
                            type="checkbox"
                            checked={autoFormat}
                            onChange={(e) => setAutoFormat(e.target.checked)}
                        />
                        Auto-format
                    </label>
                </div>

                {message && (
                    <p className={messageType === 'success' ? styles.success : styles.error}>{message}</p>
                )}

                {validationErrors.length > 0 && (
                    <div className={styles.validation}>
                        <h4>Schema Validation Errors:</h4>
                        <ul>
                            {validationErrors.map((e, i) => (
                                <li key={i}>
                                    <code>{e.instancePath || '(root)'}</code>: {e.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {output && (
                    <>
                        <div className={styles.controls} style={{ marginTop: '1rem' }}>
                            <Button onClick={handleCopy} variant="secondary">Copy</Button>
                            <Button onClick={handleDownload} variant="secondary">Download JSON</Button>
                        </div>
                        <div className={styles.output}>
                            <SyntaxHighlighter language="json" style={theme} showLineNumbers>
                                {output}
                            </SyntaxHighlighter>
                        </div>
                    </>
                )}
            </div>
        </PageWrapper>
    );
}
