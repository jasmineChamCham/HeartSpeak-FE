import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
    // Simple markdown parser for the specific format we expect
    const renderContent = (text: string) => {
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        let currentList: JSX.Element[] = [];
        let inList = false;

        lines.forEach((line, index) => {
            // Handle Headers
            if (line.startsWith('### ')) {
                if (inList) {
                    elements.push(
                        <ul key={`list-${index}`} className="list-disc pl-5 mb-4 space-y-1">
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                    inList = false;
                }
                elements.push(
                    <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-primary">
                        {formatInline(line.replace('### ', ''))}
                    </h3>
                );
            } else if (line.startsWith('## ')) {
                if (inList) {
                    elements.push(
                        <ul key={`list-${index}`} className="list-disc pl-5 mb-4 space-y-1">
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                    inList = false;
                }
                elements.push(
                    <h2 key={index} className="text-xl font-bold mt-5 mb-3 text-primary">
                        {formatInline(line.replace('## ', ''))}
                    </h2>
                );
            }
            // Handle Lists
            else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                inList = true;
                currentList.push(
                    <li key={`item-${index}`} className="text-sm leading-relaxed">
                        {formatInline(line.trim().substring(2))}
                    </li>
                );
            }
            // Handle Normal Text
            else {
                if (inList) {
                    elements.push(
                        <ul key={`list-${index}`} className="list-disc pl-5 mb-4 space-y-1">
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                    inList = false;
                }
                if (line.trim()) {
                    elements.push(
                        <p key={index} className="mb-2 text-sm leading-relaxed">
                            {formatInline(line)}
                        </p>
                    );
                } else {
                    // preserve empty lines as spacers if needed, or ignore
                }
            }
        });

        if (inList) {
            elements.push(
                <ul key="list-end" className="list-disc pl-5 mb-4 space-y-1">
                    {currentList}
                </ul>
            );
        }

        return elements;
    };

    const formatInline = (text: string): React.ReactNode[] => {
        // Regex to split by bold (**text**), italic (*text*), single quotes ('text'), and double quotes ("text")
        // Heuristic for single quotes to avoid apostrophes in contractions.
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|(?<![a-zA-Z])'.+?'(?![a-zA-Z])|".+?")/g);

        return parts.map((part, i) => {
            if (part && part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
            } else if (part && part.startsWith('*') && part.endsWith('*')) {
                return <em key={i} className="italic text-muted-foreground">{part.slice(1, -1)}</em>;
            }
            return part;
        });
    };

    return (
        <div className={cn("text-foreground", className)}>
            {renderContent(content)}
        </div>
    );
};
