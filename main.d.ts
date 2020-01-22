export = main;

declare namespace main {
    
    interface indexData {
        name: string;
        full_name: string;
        type: string;
        price: number;
        locked: boolean;
    }

    interface userData {
        name: string;
        index: indexData;
        source:string;
        balance: number;
        debt: number;
        firm?: {
            name: string;
            index: indexData;
            balance: number;
            size: number;
            creator: string;
            ceo: string;
            associates: number;
            members: userData[];
            activity: any | null;
            tax: number;
            banned: boolean;
            banned_reason: string;
            verified: boolean;
            profile_picture: string;
            about: string;
            badges: string[] | null;
        }
        firm_role: string;
        banned: boolean;
        banned_reason: string;
        admin: boolean;
        verified: boolean;
        profile_picture: string;
        about: string;
        buy_count: number;
        sell_count: number;
        joined: number | Date;
        indices: any[];
        networth: number;
        badges: string[] | null;
    }
}

declare global {
    interface Number {
        commafy(): string;
    }

    interface String {
        commafy(): string;
    }
}