import React from 'react';
import { Container, Content, Divider, Header } from 'rsuite';

import './Description.sass';

/**
 * Frontpage is shown when the user the Web-Application. If exists it shows the recently opened papers
 */
export const Description: React.FC = () => {

    return (
        <Container>
            <Header>
                <h2>Icteridae</h2> <br/> 
                <h3>Interactive Research Exploration</h3>
            </Header>
            <Divider/>
            <Content>
                <h4>What is <i>Icteridae</i>?</h4>
                <p>
                    <i>Icteridae</i> is a dynamic open-source plattform for interactive research exploration. 
                    Development began in October 2020 as part of a practical course at <a href='https://www.tu-darmstadt.de/'>TU Darmstadt</a>.
                </p>

                <h4>How can I use it to find interesting research?</h4>
                <p>
                    To find relevant research, use the search function and find a source to start reserach exploration. Select it to generate a graph based on similar papers. 
                </p>

                <h4>How are similar papers determined?</h4>
                <p>
                    To allow you to use any similarity metric you deem interesting, switching similarity metrics is as easy as varying sliders. 
                    Using the Graph Controller, an number of similaraity metrics such as co-citation count and bibliographic coupling can be weighted to produce a revealing graph.
                </p>

                <h4>Can I use other similarity metrics?</h4>
                <p>
                    Visualizing different aspects of research releations can be interesing in a large number of use cases. <i>Icteridae</i> is built with this goal in mind.
                    The source contains an easy Python interface, allowing anyone to extend similarity metrics. Feel free to fork the <a href="https://github.com/icteridae/icteridae">project</a>
                </p>

                <h4>How are the displayed papers chosen?</h4>
                <p>
                    Seperately from pairwise similarities between each node pair, <i>Icteridae</i> is making use of a single relevance metric to determine which papers to 
                    show. The top papers ranked according to the similarity metric are displayed to the user. 
                    Just as with similarities, relevance metrics can be exchanged using a simple Python interface.
                </p>

                
            
            </Content>
        </Container>
    );
}
