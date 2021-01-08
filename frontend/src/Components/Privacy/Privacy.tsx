import * as React from "react";
import { Alert, Button } from 'rsuite';
import './Privacy.css';

//This is just a Test to play around

export const Privacy: React.FC = () => (
  <div className="Privacy">
    <header className="Privacy-header">
      <h1>
        Privacy Policy
      </h1>
    </header>
    <body className="Privacy-body">
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
      </p>
      <Button appearance='ghost' color="green"
              onClick={() => Alert.error('Nein')}>
              Sind meine Daten wirklich sicher?</Button>
    </body>
  </div>
);
