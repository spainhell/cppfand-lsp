import { TextDocumentPositionParams, Hover, Position, Range, MarkupContent, MarkupKind } from 'vscode-languageserver';
import { documents } from './server';
import * as fs from 'fs';

export function ProvideHover(params: TextDocumentPositionParams): Hover {
	// Get the document
	const document = documents.get(params.textDocument.uri);

	// Get the word range at the position
	const wordPosition = getWordRangeAtPosition(document?.getText(), params.position);

	const word = document?.getText(wordPosition!);

	if (word === undefined || word?.trim() === '') {
		return {
			contents: ''
		};
	}

	const markdownContent: MarkupContent = {
		kind: MarkupKind.Markdown,
		value: `**${word}** *${getDescription(word) || ''}*`
	};

	return {
		contents: markdownContent
	};
}

function getDescription(keyword: string): string | undefined {
	const hoverData = JSON.parse(fs.readFileSync('D:/PCFAND/LSP/server/src/hover.json', 'utf-8'));
	const description = hoverData[keyword];
	return description ? description : undefined;
}

function getWordRangeAtPosition(text: string | undefined, position: Position): Range | null {
	if (!text) {
		return null;
	}

	const lines = text.split(/\r?\n/g);
	const line = lines[position.line];
	if (!line) {
		return null;
	}

	const words = line.split(/\b/g);
	let character = 0;
	for (const word of words) {
		if (character + word.length > position.character) {
			return {
				start: { line: position.line, character: character },
				end: { line: position.line, character: character + word.length }
			};
		}
		character += word.length;
	}

	return null;
}