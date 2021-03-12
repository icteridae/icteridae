

export interface Paper {

    id: string,
    title: string,
    paperAbstract: string,
    s2Url: string,
    pdfUrls: string[],
    authors: {name: string, ids : string[]}[],
    inCitations: string[],
    outCitations: string[],
    fieldsOfStudy: string[],
    year: number,
    venue: string,
    journalName: string,
    journalVolume: string,
    journalPages: string,
    doi: string,
    doiUrl: string,
    pmid: string,
    magId: string,

    citations: number,
    references: number,
    val: number,
}

export interface Similarity {

    name: string,
    description: string,

}

export interface ApiSearchResult {
    
    data: Paper[],
    max_pages: number,

}

export interface ApiPaperResult extends Paper {}

export interface ApiGraphResult {
    
    tensor: number[][][]
    paper: Paper[]
    similarities: Similarity[]

}