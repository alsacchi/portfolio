'use client';

import { useState } from "react";
import utilStyles from '../styles/utils.module.css'
import calcolaPrezzoStyle from './calcolaPrezzo.module.css'

export default function CalcolaPrezzo() {
    const [prezzo, setPrezzo] = useState(0);

    function cambiaPrezzo() {
        setPrezzo(benz.value * (dist.value / cons.value));
    }
    return (
        <center className={calcolaPrezzoStyle.wrapper}>
            <div>
                <h1>Valore societario: {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(prezzo)}</h1>
                <label for="cons" className={calcolaPrezzoStyle.label}>Consumo KM/L: </label>
                <input className={`${utilStyles.card} ${calcolaPrezzoStyle.inputText}`} type="number" id="cons" name="cons"></input><br/>
                <label for="dist" className={calcolaPrezzoStyle.label}>Distanza KM: </label>
                <input className={`${utilStyles.card} ${calcolaPrezzoStyle.inputText}`} type="number" id="dist" name="dist"></input><br/>
                <label for="benz" className={calcolaPrezzoStyle.label}>Prezzo benzina: </label>
                <input className={`${utilStyles.card} ${calcolaPrezzoStyle.inputText}`} type="number" id="benz" name="benz"></input><br/>
                <input type="button" onClick={cambiaPrezzo} className={`${utilStyles.card} ${calcolaPrezzoStyle.inputText} ${calcolaPrezzoStyle.button}`} value="Calcola"></input>
            </div>
        </center>
    );
}