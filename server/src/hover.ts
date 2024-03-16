import { TextDocumentPositionParams, Hover, Position, Range } from 'vscode-languageserver';
import { documents } from './server';

export function ProvideHover(params: TextDocumentPositionParams): Hover {
	// Get the document
	const document = documents.get(params.textDocument.uri);

	// Get the word range at the position
	const word = getWordRangeAtPosition(document?.getText(), params.position);

	return {
		contents: `Spelling matters for word: ${word}`
	};
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