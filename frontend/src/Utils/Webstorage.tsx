import { TreeInterface } from "../Components/SavedPapers/Tree/PaperTree";

/**
 * Loads the recent papers from the web-storage
 * @returns the stored recent papers
 */
export function getRecentPapers(){
    const storedPapers : Array<string> = JSON.parse(localStorage.getItem("papers") as string);
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

/**
 * returns the savedPaperTree from the webstorage
 */
export function getSavedPapers() {
    const savedPaperTree = JSON.parse(localStorage.getItem("saved") as string);
    if (!savedPaperTree)
        return [];
    return savedPaperTree;

}

/**
 * stores a new savedPaperTree to the webstorage
 * @param savedPapers is stored to the webstorage
 */
export function setSavedPapers(savedPapers: Array<TreeInterface>)
{
    if(typeof(savedPapers) !== "undefined") {
        localStorage.removeItem("saved");
        localStorage.setItem("saved", JSON.stringify(savedPapers));
    }
    return;
}

/**
 * Adds a Paper id to the saved Paper tree
 * @param id of the saved paper
 */
export function addPaper(id : string)
{
    let savedPapers = getSavedPapers();
    const ids = GetPaperIds(savedPapers);
    let value = Math.floor(Math.random() * 10000);
    while (ids.includes(value)) value = Math.floor(Math.random() * 10000);

    savedPapers.push({ value: "p" + value.toString(), id: id });

    setSavedPapers(savedPapers);
}

/**
 * local function to get an array of the stored paperIds
 * @param tree to search ids in
 */
function GetPaperIds(tree : Array<TreeInterface>) {
    let ids = [];
    for(let item in tree) {
        if(tree[item].value.charAt(0) == 'p') {
            ids.push(parseInt(tree[item].value.substring(1)));
        }
        else {
            ids.concat(GetPaperIds(tree[item].children!));
        }
    }
    return ids;
}