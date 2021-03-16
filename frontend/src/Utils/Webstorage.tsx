import { deepFilter, getSubtreePaperIds } from '../Components/SavedPapers/PageSavedPapersFunctions';
import { isDirectoryNode, PaperOrDirectoryNode } from '../Components/SavedPapers/TreeTypes';


export function checkLocalStorage(): boolean {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let x = localStorage
        // you might ask yourself why this line exists. Yeah, so did I. Sit down because you're about to learn something.
        // so imagine you're using a browser of your choice. Firefox? You're good. Chrome? Think again.
        // someone, somewhere, sometime decided that inactive localstorage on firefox just evaluated to null. 
        // That's smart, right? no localstorage, no value, no problem, null
        // not so with chrome. they're not even letting you check whether localstorage exists, chrome just straight up says no
        // now you've got about 12 hours left till your deadline and just realized all of the above because well who in his right mind 
        // could assume browsers handling localstorage differently, right?
        // alright so it's almost midnight and you're replacing every occurence of localstorage with a horrible try-catch and just hope being done.
        // yeah as if. so somehow the following line breaks chrome EVEN IF IT'S IN A TRY-CATCH BLOCK. 
        // that's my story of 'let x = localStorage'. Thank you for listening.
        return !(!localStorage)
    } catch {
        return false
    }
}

/**
 * Loads the recent papers from the web-storage
 * @returns the stored recent papers
 */
export function getRecentPapers(): string[] {
    if (!checkLocalStorage()) return []
    return JSON.parse(localStorage.getItem('papers') as string);
}

/**
 * Stores the recent papers in the web-storage
 * @param papers is the array of papers
 */
export function setRecentPapers(papers: string[]){
    if (!checkLocalStorage()) return;
    if(typeof(papers) !== 'undefined') {
        localStorage.removeItem('papers');
        localStorage.setItem('papers', JSON.stringify(papers));
    }
}

/**
 * returns the savedPaperTree from the webstorage
 */
export function getSavedPapers() {
    
    if (!checkLocalStorage()) return [];
    const savedPaperTree = JSON.parse(localStorage.getItem('savedpapers') as string);
    if (!savedPaperTree) return [];
    return savedPaperTree;  

    
}

/**
 * stores a new savedPaperTree to the webstorage
 * @param savedPapers is stored to the webstorage
 */
export function setSavedPapers(savedPapers: PaperOrDirectoryNode[])
{
    if (!checkLocalStorage()) return;
    if(typeof(savedPapers) !== 'undefined') {
        localStorage.setItem('savedpapers', JSON.stringify(savedPapers));
    }
}

/**
 * Adds a Paper id to the saved Paper tree
 * @param id of the saved paper
 */
export function addSavedPaper(id : string)
{
    let savedPapers = getSavedPapers();
    const paper_ids = getSubtreePaperIds(savedPapers);
    
    if (id in paper_ids) return;

    savedPapers.push({paperId: id });

    setSavedPapers(savedPapers);
}

export function removeSavedPaper(id: string) {
    const savedPapers = getSavedPapers();
    setSavedPapers(deepFilter(savedPapers, (node) => isDirectoryNode(node) || node.paperId !== id))
}

export function getSavedPapersList() {
    return getSubtreePaperIds(getSavedPapers())
}

export function addRecentPaper(id: string): void {
    let lst = getRecentPapers();
    setRecentPapers(lst ? [id].concat(lst.filter(x=>x!==id)).slice(0,10) : [id]);
  }

export function getSavedSliders(): number[] {
    if (!checkLocalStorage()) return [];
    return JSON.parse(localStorage.getItem('slider') as string) as Array<number>;
}

export function setSavedSliders(slider: number[]) {
    if (!checkLocalStorage()) return;
    localStorage.setItem('slider', JSON.stringify(slider));
}
