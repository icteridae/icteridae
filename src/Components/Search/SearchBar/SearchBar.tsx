import {Icon, Input, InputGroup} from "rsuite";

import './SearchBar.css'
import {useState} from "react";

interface SearchBarProps {
    text?: string;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = (props) => {
    const[input, setInput] = useState('');

    const ButtonClick = () => {
        /** TODO: IMPLEMENT API-REQUEST WITH INPUT AS PARAMETER TO BACKEND ==> SHOWING RESULT-LIST **/
    }

    return (
        <div>
            {props.text? <><div className='text'>{props.text} </div> <br /></> : null}
            <InputGroup>
                <Input placeholder={props.placeholder} onChange={(e) => setInput(e)}/>
                <InputGroup.Button onClick={ButtonClick}>
                    <Icon icon="search" />
                </InputGroup.Button>
            </InputGroup>
        </div>
    );
};
