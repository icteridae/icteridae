export function getRecentPapers(){
    let  storedPapers : Array<string> = JSON.parse(localStorage.getItem("papers") as string);
    return storedPapers;
}

export function setRecentPapers(props: Array<string>){
    if(typeof(props) !== "undefined") {
        localStorage.removeItem("papers");
        localStorage.setItem("papers", JSON.stringify(props));
        alert("saved successfully");
    }
    return;
}

export function getSavedPapers() {
    let savedPapers: Array<string> = JSON.parse(localStorage.getItem("saved") as string);
    return savedPapers;
}