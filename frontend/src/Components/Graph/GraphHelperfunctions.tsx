import React from 'react';

import { ApiGraphResult } from '../../Utils/GeneralTypes';
import Config from '../../Utils/Config';
import { addRecentPaper, getSavedSliders } from '../../Utils/Webstorage';

import Graph from './Graph';
import { useParams } from 'react-router-dom';
import { NoGraph } from './NoGraph';
import { Loader } from 'rsuite';

/**
 * Function to determine the smallest and largest number in a matrix
 * @param matrix 
 */
export const getMinAndMaxFromMatrix = (matrix : number[][]) => {
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
export const normalize = (matrix : number[][], min : number, max : number) => {
    if (min === max) return matrix.map((row : number[]) => row.map((n : number) => 0));
    return matrix.map((row : number[]) => row.map((n : number) => (n - min) / (max - min)));
}

/**
 * Returns true if the provided threshold for Link Generation results in a fully connected Graph. In other Words, that no node ends up without a link
 * @param matrix contains the Link-value for each Pair of Nodes
 * @param threshold is the threshold to determine if the link will be included in the graph or not
 */
export const checkConnections = (matrix : number[][], threshold : number) => {
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
export const findBoundary = (matrix : number[][]) => {
   let matrixC2 = JSON.parse(JSON.stringify(matrix));
   const maxOfMatrix = Math.max(...matrixC2.map((x : number[]) => Math.max(...x)));
 
   let upperBound = maxOfMatrix;
   let lowerBound = 0;
 
   for (let i = 0; i < 10; i++) {
     let mid = (upperBound + lowerBound) / 2;
     let bo = checkConnections(matrix, mid);
     if (bo) {
        lowerBound = mid;
     } else {
        upperBound = mid;
     }
   }
   return lowerBound;
}

/**
 * Generates an Array with sliderCount many elements. The values are set to totalSliderCount/slidercount if there are no values saved in the localStorage
 * @param sliderCount Number of sliders
 * @param totalSliderValue highest number a slider can have
 * @returns the values for all sliders
 */
export const choosingSliderValues = (sliderCount : number, totalSliderValue : number) => {
  const SavedSliders = getSavedSliders();
  console.log(SavedSliders?.length + "   " +   sliderCount);
  if(SavedSliders?.length !== sliderCount)
      return Array(sliderCount).fill(totalSliderValue / sliderCount);
  return SavedSliders;
}

/**
 * this method provides the values of the remaining sliders when one of them is changed
 * @param index contains the unique index of the slider that was changed
 * @param val contains the new value of the changed slider
 * @param oldValues contains all values of all sliders before the change
 * @param totalSliderValues maximum number that a slider can be
 */
 export const changeSlider = (index : number, val : number, oldValues : number[], totalSliderValue : number) => {
  if (oldValues.filter((x, i) => x === 0 || i === index).length === oldValues.length ) {
      return oldValues.map((x,i) => i === index ? val : (totalSliderValue-val)/(oldValues.length-1));
  }
  return oldValues.map((x, i) => i === index ? val : oldValues[index] === totalSliderValue ? 0 : (totalSliderValue - val) * x / (totalSliderValue - oldValues[index]));
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
      for (h = s.length - 1; h >= 0; h--) {
          o = s.charCodeAt(h);
          // eslint-disable-next-line no-mixed-operators
          a = (a<<6&268435455) + o + (o<<14);
          c = a & 266338304;
          // eslint-disable-next-line no-mixed-operators
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
    const [graph, setGraph] = React.useState<ApiGraphResult | undefined>();

    const {id} = useParams<{id : string}>();


    /*
    ** EffectHook for the initial Load of the graph
    */
    React.useEffect(() => {
      
        // This may seem useless, but below a check on graph===undefined is made to determine graph load state. When only id changes, this would lead to incorrect 
        // visual representations. graph is therefore set to undefined to reset the GraphFetcher to a clean state.
        setGraph(undefined)

        let requestURL = Config.base_url + '/api/generate_graph/?paper_id=' + id;

        addRecentPaper(id);

        fetch(requestURL)
            .then(res => res.json())
            .then((res: ApiGraphResult) => {
              if (res.paper.length > 0 && res.paper[0].id !== id) {
                setGraph({tensor: [], paper: [], similarities: []})
              } else {
                setGraph(res);
              }
            }).catch(() => console.log("Couldn't load graph"));
    }, [id]);

    return (
        !graph ? <Loader 
          className='loader' 
          content='Loading...'
          size='md'
        />
        : graph.paper.length === 0 ? <NoGraph/> 
        : <Graph data={graph}/> 
    );
}