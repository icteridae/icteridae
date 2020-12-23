import React, { useState } from 'react';
import { Button, Icon, Input, InputGroup, Modal } from 'rsuite';

export const Settings: React.FC = () => {
    const [show, setShow] = useState<boolean>(true);
    const [keyVisible, setKeyVisible] = useState<boolean>(false);
    const [apiKey, setApiKey] = useState<string>('');

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header> 
                <h2>Settings</h2>
            </Modal.Header>
            <Modal.Body>
                <div onMouseEnter={() => setKeyVisible(true)} onMouseLeave={() => setKeyVisible(false)}>
                    <Input placeholder='No API key set' onChange={setApiKey} value={keyVisible ? apiKey : 'Api key hidden'} disabled={!keyVisible}/>
                </div>
                <InputGroup inside>
                    <Input placeholder='No API key set' onChange={setApiKey} value={keyVisible ? apiKey : 'Api key hidden'} disabled={!keyVisible}/>
                    <InputGroup.Button onClick={() => setKeyVisible(!keyVisible)}>
                        <Icon icon={keyVisible ? 'eye' : 'eye-slash'}/>
                    </InputGroup.Button>
                </InputGroup>
                <InputGroup inside>
                    <Input placeholder='No API key set' onChange={setApiKey} value={keyVisible ? apiKey : 'Api key hidden'} disabled={!keyVisible}/>
                    <InputGroup.Button onClick={() => setKeyVisible(!keyVisible)}>
                        <Icon icon={keyVisible ? 'edit2' : 'eye-slash'}/>
                    </InputGroup.Button>
                </InputGroup>
            </Modal.Body>
        </Modal>
    )
}