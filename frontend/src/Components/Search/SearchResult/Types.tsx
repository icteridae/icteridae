/**
 * Interface for Data returned by the API
 * @param id
 * @param title
 * @param authors
 * @param year
 * @param fieldsOfStudy
 * @param paperAbstract
 */
interface DataInterface {
    id: number;
    title: string;
    authors: {name: string, ids:number[]}[];
    year: number;
    fieldsOfStudy: Array<string>;
    paperAbstract: string;
}

export default DataInterface;