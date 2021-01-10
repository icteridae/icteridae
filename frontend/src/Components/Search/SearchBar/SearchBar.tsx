import {Icon, Input, InputGroup} from "rsuite";

import './SearchBar.css'
import {useState} from "react";
import { useHistory } from "react-router-dom";

interface SearchBarProps {
    text?: string;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = (props) => {
    const[input, setInput] = useState('');
    let history = useHistory();

    const buttonClick = () => {
        history.push(`/results/${input}`);
    }

    return (
        <div>
            {props.text? <><div className='text'>{props.text} </div> <br /></> : null}
            <InputGroup>
                <Input placeholder={props.placeholder} onChange={(e) => setInput(e)}/>
                <InputGroup.Button onClick={buttonClick}>
                    <Icon icon="search" />
                </InputGroup.Button>
            </InputGroup>
        </div>
    );
};
