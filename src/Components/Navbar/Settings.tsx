import React, { useState } from 'react';
import { Button, Divider, FlexboxGrid, Icon, Input, InputGroup, Modal, Panel, Tooltip, Whisper } from 'rsuite';
import './styles/Settings.css'

interface SettingsProps {
    showSettings: boolean;
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Settings: React.FC<SettingsProps> = (props) => {
    const [keyVisible, setKeyVisible] = useState<boolean>(false);
    const [apiKey, setApiKey] = useState<string>('');

    //TODO CSS anpassen damit hübscher ist

    return (
        <Modal show={props.showSettings} onHide={() => props.setShowSettings(false)}>
            <Modal.Header> 
                <h2>Settings</h2>
            </Modal.Header>
            <Modal.Body>
                <div className="settingElement">
                    <h6>Api Key</h6>
                    <Whisper trigger='hover' placement='right' speaker={<Tooltip> Click the button to edit API key</Tooltip>} show={keyVisible}>
                        <InputGroup>
                            <Input placeholder='No API key set' onChange={setApiKey} value={keyVisible ? apiKey : 'Api key hidden'} disabled={!keyVisible}/>

                            <InputGroup.Button onClick={() => setKeyVisible(!keyVisible)}>
                                <Icon icon={keyVisible ? 'eye' : 'low-vision'}/>
                            </InputGroup.Button>
                        </InputGroup>
                    </Whisper>
                </div>
                <div className="settingElement">
                    <h6>Config Directory</h6>
                    <Input placeholder='This will work later. IPC needed first' /> {/* TODO: nach IPC directory auswahl einfügen */}
                </div>
                <Divider/>
                <Panel style={{borderColor: 'red'}} header='Danger Zone' bordered>
                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={12}><Button color='red' appearance='ghost' block>Reset Application</Button></FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={12}><Button color='red' appearance='ghost' block>Uninstall</Button></FlexboxGrid.Item>
                    </FlexboxGrid>
                </Panel>
            </Modal.Body>           
        </Modal>
    )
}