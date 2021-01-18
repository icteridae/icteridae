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
        alert("saved successfully");
    }
    return;
}