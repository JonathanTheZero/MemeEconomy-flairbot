declare global {
    interface indexData {
        name: string;
        full_name: string;
        type: string;
        price: number;
        locked: boolean;
    }
    interface Number {
        commafy(): string;
    }
    interface String {
        commafy(): string;
    }
}
export {};
