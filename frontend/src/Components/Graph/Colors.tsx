import pallette1 from 'colorkind/dist/2';
import pallette2 from 'colorkind/dist/6';
import pallette3 from 'colorkind';
import pallette4 from 'colorkind/dist/11';
import pallette5 from 'colorkind/dist/12';

export const pallettes : [string, string[]][] = [
    ['2 Colors - Tol', pallette1],
    ['6 Colors - Tol', pallette2],
    ['7 Colors - Tol', pallette3],
    ['11 Colors - Tol', pallette4],
    ['12 Colors - Tol', pallette5],
    ['Achromatic', ['3', '4', '5', '6', '7', '8', '9', 'A', 'B'].map(s => '#' + s+s+s+s+s+s)],
]