import React, { useEffect, useState } from 'react';

import { Icon, IconButton, Whisper, Popover } from 'rsuite';

import { addSavedPaper, getSavedPapersList, removeSavedPaper } from '../../Utils/Webstorage';

export const Bookmark: React.FC<{paper_id: string, savedPapers?: string[], size?: 'xs' | 'md' | 'lg' | 'sm'}> = (props) => {

    const [isSaved, setIsSaved] = useState<boolean>(props.savedPapers !== undefined ? props.savedPapers.includes(props.paper_id) : getSavedPapersList().includes(props.paper_id))

    useEffect(() => {
        setIsSaved(props.savedPapers !== undefined ? props.savedPapers.includes(props.paper_id) : getSavedPapersList().includes(props.paper_id))
    }, [props.paper_id, props.savedPapers])

    return (
        <Whisper
            trigger='click'
            placement='top'
            speaker={isSaved ? <Popover title='Paper has been saved' /> : <></>}
            style={{ 'zIndex': 2 }}
        >
            <IconButton
            size={props.size == null ? 'xs' : props.size}
            icon={<Icon icon={isSaved ? 'bookmark' : 'bookmark-o'} />}
            appearance='subtle'
            onClick={() => {
                if (isSaved) {
                    removeSavedPaper(props.paper_id); 
                    setIsSaved(false);
                }
                else {
                    addSavedPaper(props.paper_id); 
                    setIsSaved(true);
                }
            }}/>
        </Whisper>
    )
}
    