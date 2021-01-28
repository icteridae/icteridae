/**
 * Loads the recent papers from the web-storage
 * @returns the stored recent papers
 */
export function getRecentPapers(){
    let  storedPapers : Array<string> = JSON.parse(localStorage.getItem("papers") as string);
    return storedPapers;
}

/**
 * Stores the recent papers in the web-storage
 * @param papers is the array of papers
 */
export function setRecentPapers(papers: Array<string>){
    if(typeof(papers) !== "undefined") {
        localStorage.removeItem("papers");
        localStorage.setItem("papers", JSON.stringify(papers));
    }
    return;
}

export function getSavedPapers() {
    let savedPaperTree = JSON.parse(localStorage.getItem("saved") as string);
    if (!savedPaperTree)
        return [];
    return savedPaperTree;

}

export function setSavedPapers(savedPapers: any)
{
    if(typeof(savedPapers) !== "undefined") {
        localStorage.removeItem("saved");
        localStorage.setItem("saved", JSON.stringify(savedPapers));
    }
    return;
}