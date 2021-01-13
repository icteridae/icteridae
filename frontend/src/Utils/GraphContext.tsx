import React, { useContext, useState } from 'react';
import Config from './Config';
import history from './history'

// List of (paperid, papername)
const PaperNameListContext = React.createContext<{id: string, title: string}[]>([]);

// Dictionary from paperid to graphobject
const PaperGraphContext = React.createContext<{[id: string]: object | null}>({});

// Graph generate function
const GenerateGraphContext = React.createContext<({id, title}: {id: string, title: string}) => void>(() => {});

export const usePaperNameList = () => (useContext(PaperNameListContext))

export const usePaperGraph = () => (useContext(PaperGraphContext))

export const useGenerateGraph = () => (useContext(GenerateGraphContext))

export const GraphContextProvider: React.FC = ({children}) => {

    const [paperNameList, setPaperNameList] = useState<{id: string, title: string}[]>([])
    const [paperGraph, setPaperGraph] = useState<{[id: string]: object | null}>({})

    console.log('nico is nen peter')

    const spawnGraph = (paper: {id: string, title: string}) => {
        console.log(paper)

        if (paperNameList.find((x) => x.id == paper.id)) {
            history.push('/graph/' + paper.id);
            return;
        }

        console.log('Hier so')

        setPaperNameList([...paperNameList, {id: paper.id, title: paper.title}])

        setPaperGraph(values => ({...values, [paper.id]: null}))
        
        // Prepare to cry
        // We need to know whether a graph exists even before it finishes loading
        // We do this by assigning null to the respective key. This makes it not undefined so that the Router knows that the route exists, but still loads
        // In the next function we then overwrite the key to update to the new graph object. This will cause a react state change in the graph and load it

        fetch(Config.base_url + '/api/generate_graph/?paper_id=' + paper.id)
                .then(res => res.json())
                .then(res => {
                    setPaperGraph(values => ({...values, [paper.id]: res}))
                })

        history.push('/graph/' + paper.id);
    };

    return (
        <PaperNameListContext.Provider value={paperNameList}>
        <PaperGraphContext.Provider value={paperGraph}>
        <GenerateGraphContext.Provider value={spawnGraph}>
            {children}
        </GenerateGraphContext.Provider>
        </PaperGraphContext.Provider>
        </PaperNameListContext.Provider>
    )
}