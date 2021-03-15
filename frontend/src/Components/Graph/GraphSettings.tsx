import React from 'react';

import { ButtonGroup, Button, SelectPicker, Slider } from 'rsuite';

import './Graph.sass';

interface GraphSettingsTypes {
    showTitle : boolean, 
    showLegend : boolean, 
    nodeColoring : boolean, 
    pallette : [string, string[]], 
    pallettes : [string, string[]][], 
    setShowTitle : React.Dispatch<React.SetStateAction<boolean>>, 
    setShowLegend : React.Dispatch<React.SetStateAction<boolean>>, 
    setNodeColoring : React.Dispatch<React.SetStateAction<boolean>>, 
    setPallette : React.Dispatch<React.SetStateAction<[string, string[]]>>, 
    setweakLinkFilter : React.Dispatch<React.SetStateAction<number>>, 
    setNodeRepelling : React.Dispatch<React.SetStateAction<number>>
}

export const GraphSettings: React.FC<GraphSettingsTypes> = (props) => {
    return (
        <div className='graph-settings'>
            <span className='graph-settings-title'>Settings</span>
            <span className='graph-settings-subtitle-first'>Node Label</span>
            <ButtonGroup>
                <Button className='switch-button-2' appearance={props.showTitle ? 'ghost' : 'primary'} onClick={() => props.setShowTitle(false)}>Author, Year</Button>
                <Button className='switch-button-2' appearance={props.showTitle ? 'primary' : 'ghost'} onClick={() => props.setShowTitle(true)}>Title</Button>
            </ButtonGroup>
            <span className='graph-settings-subtitle'>Legend</span>
            <ButtonGroup>
                <Button className='switch-button-2' appearance={props.showLegend ? 'primary' : 'ghost'} onClick={() => props.setShowLegend(true)}>On</Button>
                <Button className='switch-button-2' appearance={props.showLegend ? 'ghost' : 'primary'} onClick={() => props.setShowLegend(false)}>Off</Button>
            </ButtonGroup>
            <span className='graph-settings-subtitle'>Node Coloring</span>
            <ButtonGroup>
                <Button className='switch-button-2' appearance={props.nodeColoring ? 'ghost' : 'primary'} onClick={() => props.setNodeColoring(false)}>Year</Button>
                <Button className='switch-button-2' appearance={props.nodeColoring ? 'primary' : 'ghost'} onClick={() => props.setNodeColoring(true)}>Field of Study</Button>
            </ButtonGroup>
            <span className='graph-settings-subtitle'>Colorblindness Pallettes for Field Of Study</span>
            <SelectPicker 
                data={props.pallettes.map(x => ({value: x, label: x[0]}))}
                searchable={false}
                cleanable={false}
                value={props.pallette}
                onSelect={props.setPallette}/>
            <span className='graph-settings-subtitle'>Weak Link Filter</span>
            <Slider className='graph-settings-slider'
                progress
                defaultValue={0}
                onChange={value => {
                    props.setweakLinkFilter(value/100);
                }}
            />
            <span className='graph-settings-subtitle'>Node Repelling Force</span>
            <Slider className='graph-settings-slider'
                progress
                defaultValue={0}
                onChange={value => {
                    props.setNodeRepelling(value);
                }}
            />
        </div>
    )
}