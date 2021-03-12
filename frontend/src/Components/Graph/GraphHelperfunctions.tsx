import React from 'react';

import { PapersAndSimilarities } from './GraphTypes';
import Config from '../../Utils/Config';
import { addRecentPaper } from '../../Utils/Webstorage';

import Graph from './Graph';
import { useParams } from 'react-router-dom';

/**
 * Function to determine the smallest and largest number in a matrix
 * @param matrix 
 */
export const GetMinAndMaxFromMatrix = (matrix : number[][]) => {
    let min = matrix[0][0];
    let max = 0;
    for (let i = 0; i < matrix.length; i++){
        for (let j = 0; j < i; j++){
            if (matrix[i][j] < min){
                min = matrix[i][j];
            }
            if (matrix[i][j] > max){
                max = matrix[i][j];
            }
        }
    }
    return [min, max];
}

/**
 * Normalizes the given Matrix
 * @param matrix that will be normalized
 * @param min smallest value in the matrix
 * @param max largest value in the matrix
 */
export const Normalize = (matrix : number[][], min : number, max : number) => {
    if (min === max) return matrix.map((row : number[]) => row.map((n : number) => 0));
    return matrix.map((row : number[]) => row.map((n : number) => (n - min) / (max - min)));
}

/**
 * Returns true if the provided threshold for Link Generation results in a fully connected Graph. In other Words, that no node ends up without a link
 * @param matrix contains the Link-value for each Pair of Nodes
 * @param threshold is the threshold to determine if the link will be included in the graph or not
 */
export const CheckConnections = (matrix : number[][], threshold : number) => {
    let matrix_c = JSON.parse(JSON.stringify(matrix));
    matrix_c = matrix_c.map((x : number[]) => x.map(z => z>threshold ? z : -1));
    let x : Set<number> = new Set();
    x.add(0);
    for (let i = 0; i<matrix_c.length; i++) {
      for (let val of [...Array.from(x)]) {
        for (let k = 0; k < matrix_c.length; k++) {
          if (matrix_c[val][k] > -1) {
            x.add(k);
            if (x.size === matrix_c.length) {
              return true;
            }
          }
        }
      }
    }
    return false;
 };
 
 /**
  * Function to determine the smallest threshhold for Link Generation so that every Node ist still connected.
  */
export const  FindBoundary = (matrix : number[][]) => {
   let matrixC2 = JSON.parse(JSON.stringify(matrix));
   const maxOfMatrix = Math.max(...matrixC2.map((x : number[]) => Math.max(...x)));
 
   let upperBound = maxOfMatrix;
   let lowerBound = 0;
 
   for (let i = 0; i < 10; i++) {
     let mid = (upperBound + lowerBound) / 2;
     let bo = CheckConnections(matrix, mid);
     if (bo) {
        lowerBound = mid;
     } else {
        upperBound = mid;
     }
   }
   return lowerBound;
}

/**
 * Simple Hashfunction. These Variables dont have a real Meaning and the function will only be used to generate colors.
 * @param s is a string that we want to hash
 * @returns the hash Value of s
 */
export const hash = (s : string) : number => {
  /* Simple hash function. */
  var a = 1, c = 0, h, o;
  if (s) {
      a = 0;
      /*jshint plusplus:false bitwise:false*/
      for (h = s.length - 1; h >= 0; h--) {
          o = s.charCodeAt(h);
          a = (a<<6&268435455) + o + (o<<14);
          c = a & 266338304;
          a = c!==0?a^c>>21:a;
      }
  }
  return a;
};

/**
 * Function to transform a colorcode from hex to rgba
 * @param hex colorcode as hex-string (#000000 for example)
 * @param alpha is a number between 0 and 1 as string. Not necessary for a RGB Color.
 * @returns a string in rgb format
 */
export const hexToRGB = (hex : string, alpha : string) : string => {
  var red = parseInt(hex.slice(1, 3), 16),
      green = parseInt(hex.slice(3, 5), 16),
      blue = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
      return "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
  } else {
      return "rgb(" + red + ", " + green + ", " + blue + ")";
  }
}

/**
 * Helperfunction to fetch Graph Data during Development. Will be deleted in later Versions
 */
export const GraphFetch: React.FC = () => {
    /*
    ** useState Hook to save the graphData 
    */
    const [graph, setGraph] = React.useState<PapersAndSimilarities>({tensor: [], paper: [], similarities: []});

    const {id} = useParams<{id : string}>();


    /*
    ** EffectHook for the initial Load of the graph
    */
    React.useEffect(() => {
        //loadData();

        setGraph({tensor: [], paper: [], similarities: []})
        let requestURL = Config.base_url + '/api/generate_graph/?paper_id=' + id;

        addRecentPaper(id);

        fetch(requestURL)//f0afdccf2903039d202085a771953a171dfd57b1')nicer Graph //204e3073870fae3d05bcbc2f6a8e263d9b72e776')Attention is all you need
            .then(res => res.json())
            .then(res => {
              setGraph(res);
            }).catch(() => console.log("Couldn't load graph"));
    }, [id]);

    /*
    ** loadData fetches the graph_Data from the backend and saves the generated Graph in the State Hook graph
    *
    const loadData = () => {
        fetch(Config.base_url + '/api/generate_graph/?paper_id=' + id)//f0afdccf2903039d202085a771953a171dfd57b1')nicer Graph //204e3073870fae3d05bcbc2f6a8e263d9b72e776')Attention is all you need
            .then(res => res.json())
            .then(res => {setGraph(res);
                            return res});
    };*/

    return (
        <Graph data={graph}/>
    );
}