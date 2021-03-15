import React from 'react';

import { Drawer, Whisper, Icon, Popover, Slider, InputNumber, Divider } from 'rsuite';
import Linkify from 'react-linkify';

import { GraphSettings } from './GraphSettings';
import { ApiGraphResult } from './../../Utils/GeneralTypes';

import './Graph.sass'

interface GraphControllerDrawerTypes {
    data: ApiGraphResult,
    controllerDrawer : boolean,
    sliders : number[],
    totalSliderValue : number,
    showTitle : boolean, 
    showLegend : boolean, 
    nodeColoring : boolean, 
    pallettes : [string, string[]][], 
    pallette : [string, string[]], 
    setControllerDrawer : (value: React.SetStateAction<boolean>) => void,
    setSliders : (value: React.SetStateAction<number[]>) => void,
    setSavedSliders : (slider: number[]) => void,
    setShowTitle : React.Dispatch<React.SetStateAction<boolean>>, 
    setShowLegend : React.Dispatch<React.SetStateAction<boolean>>, 
    setNodeColoring : React.Dispatch<React.SetStateAction<boolean>>, 
    setPallette : React.Dispatch<React.SetStateAction<[string, string[]]>>, 
    setweakLinkFilter : React.Dispatch<React.SetStateAction<number>>, 
    setNodeRepelling : React.Dispatch<React.SetStateAction<number>>
    changeSlider : (index: number, val: number, oldValues: number[], totalSliderValue: number) => number[],
}

export const GraphControllerDrawer: React.FC<GraphControllerDrawerTypes> = (props) => {
    return (
        <Drawer
            className='rs-drawer'
            show={props.controllerDrawer}
            placement='left'
            backdrop={false}
            onMouseLeave={() => props.setControllerDrawer(false)}
            onHide={() => props.setControllerDrawer(false)}
        >
            <Drawer.Header>
                <Drawer.Title>
                    Graph Controller
                </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <div className='slider-popup'>
                    <span className='graph-settings-title'>Similarites</span>
                    {props.sliders.map((sliderVal : number, index) => (
                        <div className='slider'>
                            <div>{props.data.similarities[index].name + ':  '}
                                <Whisper placement="right" trigger="hover" speaker={<Popover title={props.data.similarities[index].name}>
                                        <Linkify><p>{props.data.similarities[index].description}</p></Linkify>
                                    </Popover>} enterable>
                                    <Icon icon="info"/>
                                </Whisper></div>
                            <div className='slider-with-input-number' key={index}>
                                    <Slider
                                        step= {0.1}
                                        progress
                                        style={{ marginTop: 16, marginRight: 10 }}
                                        handleStyle={{ paddingTop: 7 }}
                                        value={Number(Number(sliderVal).toFixed(2))}
                                        onChange={value => {
                                            const newSliders = props.changeSlider(index, value, props.sliders, props.totalSliderValue);
                                            props.setSliders(newSliders);
                                            props.setSavedSliders(newSliders);
                                        }}
                                        />
                                    <InputNumber
                                        min={0}
                                        max={props.totalSliderValue}
                                        value={Number(Number(sliderVal).toFixed(1))}
                                        onChange={value => {
                                            if (0 <= value && 100 >= value){
                                                let newSliders = props.changeSlider(index, (value as number), props.sliders, props.totalSliderValue);
                                                props.setSliders(newSliders);
                                                props.setSavedSliders(newSliders);
                                            }
                                        }}
                                    />
                                </div>
                        </div>)
                    )}
                    <Divider />
                    <GraphSettings  showTitle={props.showTitle} 
                                    setShowTitle={props.setShowTitle} 
                                    showLegend={props.showLegend} 
                                    setShowLegend={props.setShowLegend} 
                                    nodeColoring={props.nodeColoring} 
                                    setNodeColoring={props.setNodeColoring} 
                                    pallettes={props.pallettes} 
                                    pallette={props.pallette} 
                                    setPallette={props.setPallette}
                                    setweakLinkFilter={props.setweakLinkFilter}
                                    setNodeRepelling={props.setNodeRepelling}
                                    />
                </div>
            </Drawer.Body>
        </Drawer>
    )
}