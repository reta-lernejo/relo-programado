/** helpfunkcioj por pli konforta uzo de tau-prolog */

function preparu_ekzercojn(prologo) {

    document.querySelectorAll(".prolog-ekzerco button").forEach(butono => {
        butono.addEventListener("click", () => {
            const ekzemplo = butono.closest(".prolog-ekzerco");
            const demando = ekzemplo.querySelector(".demando");
            const respondo = ekzemplo.querySelector(".respondo code");
            const maks_respondoj = respondo.dataset.maksRspnd || 1;
            prologo(demando,respondo,maks_respondoj);
        });
    });
}

function preparu_programojn() {
    document.querySelectorAll(".programo").forEach(programo => {
        const kodo = programo.querySelector("code");
        kodo.parentElement.setAttribute("contenteditable",true);

        const lininombroj = document.createElement("div");
        lininombroj.classList.add("lininombroj");

        const ln = kodo.innerText.split("\n").length;
        lininombroj.innerHTML = Array.from({ length: ln }, (_, i) => i + 1).join("<br>");

        programo.prepend(lininombroj);
    });
}


/**
 * Ŝargas programon (faktoj kaj predikatoj), donitan kiel signaro, plej komforte kiel plurlinia
 * uzante klinitajn citilojn `...`
 * @param {*} programo 
 * @returns seancon por posta pridemandado
 */
function konsultu(programo,seanco = null) {
    let snc = seanco? seanco : pl.create();
        
    return new Promise((resolve, reject) => {
        snc.consult(programo, {
            success: () => resolve(snc), // redonu la seancon por la sekva paŝo
            error: (err) => {
                console.error(`erara programo: ${err}`);
                reject(new Error(`erara programo: ${err}`))
            }
        });
    });
}

async function konsultu_plurajn(programoj,opc={},seanco=null) {
    let snc = seanco? seanco : pl.create();

    function _konsultu(prg) {
        return new Promise((resolve, reject) => {
            snc.consult(prg, Object.assign(opc,{
                success: () => resolve(snc), // redonu la seancon por la sekva paŝo
                error: (err) => {
                    console.error(`erara programo: ${err}`);
                    reject(new Error(`erara programo: ${err}`))
                }
            }));
        });
    }

    for (p of programoj) {
        await _konsultu(p);
    }

    return snc;
}

function demandu(seanco, demando) {
    return new Promise((resolve, reject) => {
        seanco.query(demando, {
            success: () => resolve(seanco), // redonu la seancon por la sekva paŝo
            error: (err) => {
                console.error(`erara demando: ${err}`);
                reject(new Error(`erara demando: ${err}`))
            }
        });
    });
}

function sekva_respondo(seanco) {
    return new Promise((resolve, reject) => {
        seanco.answer({
            success: (respondo) => resolve(respondo),
            fail: () => resolve(null), // ne (plu) troviĝas respondoj
            error: (err) => {
                console.error(`responderaro: ${responderaro(err)}`);
                reject(new Error(responderaro(err)))
            },
            limit: () => {
                console.error(`tro multaj penseroj`);
                reject(new Error("tro multaj penseroj"))
            }
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
 * @param {*} demando HTML-elemento (aŭ ties id) kun la demando
 * @param {*} respondo HTML-elemento (aŭ ties id) kun la respondo
 * @param {number} maksimumo de respondoj, apriore 1, se 0 t.e. ĉiuj
 */
async function demando_respondo(seanco,demando,respondo,maks_respondoj=1) {
    const demandElemento = (demando instanceof HTMLElement)? demando : document.getElementById(demando);
    const respondElemento = (respondo instanceof HTMLElement)? respondo : document.getElementById(respondo);

    try {

        const demandkodo = demandElemento.innerText;
        // forigu evtl. antaŭajn respondojn
        respondElemento.textContent = '';

        await demandu(seanco, demandkodo);
        //console.log("✓ Demando sukcese kompreniĝis.");
        console.log('demando: '+demandkodo);

        await malplenigu_respondon(respondElemento);

        // ricevu unua respondon
        //let respondo = await sekva_respondo(seanco);
        let kiom = 0;

        let respondkodo;
        while ( (kiom < maks_respondoj || maks_respondoj == 0) 
            &&  (respondkodo = await sekva_respondo(seanco)) ) {

            kiom += 1;

            if (respondkodo) {
                respondElemento.append(
                    (pl.format_answer(respondkodo)).replace(/^true/,'jes')
                    +(maks_respondoj>1?'; ':''));
            } else {
                console.log("Neniu solvo trovita (false).");
            }
            //respondo = await sekva_respondo(seanco);
        }

        // montru "ne." se neniu respondo troviĝis
        if(!kiom) respondElemento.append('ne');

    } catch (error) {
        console.error("Ĝenerala eraro:", error.message);        
        respondElemento.append('('+error.message+')');
    }
}

async function malplenigu_respondon(respondo) {
    const respondElemento = (respondo instanceof HTMLElement)? 
        respondo : document.getElementById(respondo);
    const info = respondElemento.parentElement.querySelector(".informo");
    // malplenigu respondon kaj informon
    respondElemento.textContent = '';
    info.textContent = '';
    // aktualigu antaŭ kalkuli
    await new Promise(resolve => setTimeout(resolve, 0));
}

// PLIBONIGU: kunigu doni respondon kaj informojn
// same kiel malplenigi
async function tau_info(respondo,informo) {
    const respondElemento = (respondo instanceof HTMLElement)? 
        respondo : document.getElementById(respondo);
    const info = respondElemento.parentElement.querySelector(".informo");

    if (info) {
        info.innerHTML = informo;
    }
}

/***
var pl;
(function( pl ) {
    // Name of the module
    var name = "my_dom";
    // Object with the set of predicates, indexed by indicators (name/arity)
    var predicates = function() {
        return {
            // p/1
            "js_dom/2": function(thread, point, atom) {

                var js = atom.args[0], element = atom.args[1];
                
                if( !pl.type.is_variable( element ) ) {
                    session.throw_error( pl.error.type( "HTMLObject", element, atom.indicator ) );    
                }        
    
                if(js.value instanceof HTMLElement ||
                   js.value instanceof SVGElement) {
    
                    var html = new pl.type.DOM( js.value );
                    session.prepend( [
                        new pl.type.State( 
                            point.goal.replace( 
                                new pl.type.Term( "=", [html, element] ) ), 
                                point.substitution, 
                                point 
                        )
                    ] );    
                }
                //    thread.success(point.replace(
                //        new pl.type.State(
                //            point.goal.replace(
                //                new pl.type.Substitution({
                //                    DOMObject: dom
                //                })
                //            )
                //        )
                //    ));
            } // js_dom/2
        } // return
    }; // predicates
    // List of predicates exported by the module
    var exports = ["js_dom/2"];

    var options = {
        // List the dependencies of your module (ie. the 'lists' module)
        dependencies: ['dom']
    }

    // DON'T EDIT
    if( typeof module !== 'undefined' ) {
        module.exports = function(tau_prolog) {
            pl = tau_prolog;
            new pl.type.Module( name, predicates(), exports, options );
        };
    } else {
        new pl.type.Module( name, predicates(), exports, options );
    }
})( pl );
**/

// Registriere ein eigenes "spy"-Modul
//var debugPredicates = {
//    "spy/1": function(thread, point, atom) {
//        var arg = atom.args[0];
//        // Gibt den aktuellen Begriff formatiert in der Browser-Konsole aus
//        console.log("-> PROLOG STEP:", arg.toString());
//        
//        // Prolog einfach normal weiterlaufen lassen
//        thread.prepend([new pl.type.State(
//            point.goal.replace(atom, null), 
//            point.substitution, 
//            point
//        )]);
//    }
//};
//new pl.type.Module("debug_helper", debugPredicates, ["spy/1"]);