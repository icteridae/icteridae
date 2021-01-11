export function getRecentPapers(){
    let  storedPapers : Array<string>|undefined = JSON.parse(localStorage.getItem("papers") as string);
    return storedPapers;
}

export function setRecentPapers(props: Array<string> | undefined){
    if(props !== undefined)
        localStorage.setItem("papers", JSON.stringify(props));
        alert("Succesfull saved");
    return;
}