/** helpfunkcioj por pli konforta uzo de tau-prolog */

/**
 * Ŝargas programon (faktoj kaj predikatoj), donitan kiel signaro, plej komforte kiel plurlinia
 * uzante klinitajn citilojn `...`
 * @param {*} programo 
 * @returns seancon por posta pridemandado
 */
function konsultu(prologo,programo) {
        
    return new Promise((resolve, reject) => {
        const seanco = prologo.create();
        seanco.consult(programo, {
            success: () => resolve(seanco), // redonu la seancon por la sekva paŝo
            error: (err) => reject(new Error(`erara programo: ${err}`))
        });
    });
}

function demandu(seanco, demando) {
    return new Promise((resolve, reject) => {
        seanco.query(demando, {
            success: () => resolve(seanco), // redonu la seancon por la sekva paŝo
            error: (err) => reject(new Error(`erara demando: ${err}`))
        });
    });
}

function sekva_respondo(seanco) {
    return new Promise((resolve, reject) => {
        seanco.answer({
            success: (respondo) => resolve(respondo),
            fail: () => resolve(null), // ne (plu) troviĝas respondoj
            error: (err) => reject(new Error(responderaro(err))),
            limit: () => reject(new Error("tro longa kalkulado"))
        });
    });
}

function responderaro(eraro) {
    let msg = eraro;

    if (eraro && typeof eraro === 'object' && eraro.id === "throw" && eraro.args && eraro.args.length > 0) {
        const ena = eraro.args[0];
        
        // Falls das Innere wieder ein komplexer Term/Atom ist, in Text umwandeln
        msg = typeof ena.toString === 'function' 
            ? ena.toString() 
            : ena;
    } else if (eraro && typeof eraro.toString === 'function') {
        msg = eraro.toString();
    }

    return msg;
}

/**
 * Prenas demandon al prologo el HTML-elemento donitan per sia id
 * kaj eltrovas ĉiujn respondojn ĝis donita maksimumo kaj adlonas ilin
 * en HTML-elemento donita per sia id
 * @param {*} seanco la seanco kun la ŝargita programo
 * @param {*} id_demando HTML-elemento kun la demando
 * @param {*} id_respondo HTML-elemento kun la respondo
 * @param {number} maksimumo de respondoj, apriore 1, se 0 t.e. ĉiuj
 */
async function demando_respondo(seanco,id_demando,id_respondo,maks_respondoj=1) {
    try {
        const demando = document.querySelector(`#${id_demando} code`)
            .textContent
            .replace(/^\s*\?\-/,'');
        // forigu evtl. antaŭajn respondojn
        document.getElementById(id_respondo).textContent ='';

        await demandu(seanco, demando);
        //console.log("✓ Demando sukcese kompreniĝis.");
        console.log('demando: '+demando)

        // ricevu unua respondon
        //let respondo = await sekva_respondo(seanco);
        let kiom = 0;

        let respondo;
        while( (respondo = await sekva_respondo(seanco)) 
            && (kiom < maks_respondoj || maks_respondoj == 0) ) {
            kiom += 1;

            if (respondo) {
                document.getElementById(id_respondo).append(
                    (pl.format_answer(respondo)).replace(/^true/,'jes')
                    +' ');
            } else {
                console.log("Neniu solvo trovita (false).");
            }
            //respondo = await sekva_respondo(seanco);
        }

        // montru "ne." se neniu respondo troviĝis
        if(!kiom) document.getElementById(id_respondo).append('ne.');

    } catch (error) {
        console.error("Ĝenerala eraro:", error.message);        
        document.getElementById(id_respondo).append('('+error.message+')');
    }
}
