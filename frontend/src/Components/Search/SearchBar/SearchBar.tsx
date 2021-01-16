import {Icon, Input, InputGroup} from "rsuite";

import './SearchBar.css'
import {useState} from "react";
import { useHistory } from "react-router-dom";

/**
 * Represents the properties for the Searchbar
 */
interface SearchBarProps {
    text?: string;
    placeholder?: string;
}

/**
 * @param props are the text and placeholder for the Searchbar. Text is shown above the Bar, placeholder is shown insinde the bar
 * @returns the Searchbar
 */
export const SearchBar: React.FC<SearchBarProps> = (props) => {
    const[input, setInput] = useState('');
    let history = useHistory();

    /**
     * opens the reult page with the given input
     */
    const buttonClick = () => {
        history.push(`/results/${input}`);
    }

    return (
        <div>
            {props.text? <><div className='text'>{props.text} </div> <br /></> : null}
            <InputGroup id="search-bar-group">
                <Input id="search-bar" placeholder={props.placeholder} onChange={(e) => setInput(e)}/>
                <InputGroup.Button onClick={buttonClick}>
                    <Icon icon="search" />
                </InputGroup.Button>
            </InputGroup>
        </div>
    );
};
