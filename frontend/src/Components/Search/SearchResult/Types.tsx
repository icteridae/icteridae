/**
 * Interface for Data returned by the API
 */
export interface DataInterface {
    id: string;
    title: string;
    authors: {name: string, ids:number[]}[];
    year: number;
    fieldsOfStudy: Array<string>;
    inCitations: Array<string>;
    outCitations: Array<string>;
    paperAbstract: string;
}