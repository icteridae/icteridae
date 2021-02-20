/**
 * Interface for Data returned by the API
 */
export interface DataInterface {
    id: string;
    title: string;
    authors: {name: string, id:number}[];
    year: number;
    fieldsOfStudy: Array<string>;
    inCitations: Array<string>;
    outCitations: Array<string>;
    paperAbstract: string;
}