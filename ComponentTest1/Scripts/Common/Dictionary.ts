export default function W(id: string): string {
    return Dictionary.getWord(id);
}

export class Dictionary {
    private static vocabulary: { [id: string]: string } = {};

    static setVocabulary(vocabulary: { [id: string]: string }) {
        Dictionary.vocabulary = vocabulary;
    }

    static getVocabulary() {
        return Dictionary.vocabulary
    }

    static getWord(id: string): string {
        return Dictionary.vocabulary[id] || id;
    }
}
