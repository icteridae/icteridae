/**
 * Interface for Data returned by the API
 */
interface DataInterface {
    id: number;
    title: string;
    authors: {name: string, ids:number[]}[];
    year: number;
    fieldsOfStudy: Array<string>;
    inCitations: Array<string>;
    outCitations: Array<string>;
    paperAbstract: string;
}

export default DataInterface;