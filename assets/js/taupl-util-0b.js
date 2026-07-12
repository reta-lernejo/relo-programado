/** helpfunkcioj por pli komforta uzo de tau-prolog */

function preparu_programojn() {
    let lpos = 0;
    document.querySelectorAll(".programo").forEach(programo => {
        const kodo = programo.querySelector("code");
        kodo.parentElement.setAttribute("contenteditable",true);

        const ln_div = document.createElement("div");
        const ln_pre = document.createElement("pre");        
        ln_pre.classList.add("lininombroj");
        ln_div.append(ln_pre)

        programo.prepend(ln_pre);
        lpos = lininombroj(programo,lpos);

        kodo.parentElement.addEventListener("input", (event) => {
            const pre = event.currentTarget;
            const prg = pre.closest(".programo");
            renombrado(prg);
        });
    });
}

function preparu_demandojn(programo, limo=0) {

    document.querySelectorAll(".prolog-demando").forEach(kadro => {
        let seanco;
        let kiom = 0; // kiom da respondoj ni jam trovis

        // la diversaj elementoj en la demando-kadro
        const ek = kadro.querySelector("button[name='ek']");
        const demando = kadro.querySelector(".demando");
        const respondo = kadro.querySelector(".respondo code");
        const maks_respondoj = respondo.dataset.maksRspnd || 1;
        const plu = kadro.querySelector("button[name='plu']");
        const halt = kadro.querySelector("button[name='halt']");

        function haltu(seanco) {
            seanco_haltu(seanco,respondo);
            plu.classList.add("kashita");
            halt.classList.add("kashita");
            ek.classList.remove("kashita");
        };    
        
        // ni demandos unuafoje per la butono ⏵
        ek.addEventListener("click", async () => {

            seanco = await faru_demandon(programo,demando,respondo,maks_respondoj,limo);
            //prologo(demando,respondo,maks_respondoj);
            // KOREKTU: ni ankaŭ bezonas la informon, ĉu unua respondo troviĝis
            kiom = 1; // provizore supozu ni ricevis almenaŭ 1 respondon

            if (kiom && maks_respondoj > 1) {
                // kaŝu ek-butonon dum ni serĉas pliaj respondojn
                ek.classList.add("kashita");
                // montru la butonojn por pluserĉi...
                plu.classList.remove("kashita");
                halt.classList.remove("kashita");
            }
        }); // ek.addEventListener

        // pliajn respondojn ni ricevos per la butono ⏵+
        plu.addEventListener("click", async () => {
            const rsp = await trovu_respondon(seanco,respondo,maks_respondoj);

            // ĉe la lasta aŭ maks_respondo ni haltu
            if (!rsp || ++kiom >= maks_respondoj) {
                haltu(seanco);
            }
        }); // plu.addEventListener

        // ni haltos per butono ⏹
        halt.addEventListener("click", async () => {
            haltu(seanco);
        }); // halt.addEventListener

    }); // .prolog-demando forEach 
}

async function faru_demandon(programo,demando,respondo,maks_respondoj,limo) {
    const prg = typeof programo === "function"? programo() : programo;

    try {
        // 1. konsulti la programon
        const seanco = pl.create(limo);
        await konsultu(prg,respondo,seanco);

        // 2. metu la demandon
        const demandkodo = demando.innerText;   
        await demandu(seanco, demandkodo);
        //console.log("✓ Demando sukcese kompreniĝis.");
        console.log('demando: '+demandkodo);
        await malplenigu_respondon(respondo);

        // trovu unuan respondon
        await trovu_respondon(seanco,respondo,maks_respondoj);

        return seanco;

    } catch (error) {
        console.error("Ĝenerala eraro:", error.message);        
        respondo.append('('+error.message+')');
    }        
}


function seanco_haltu(seanco,respondo) {
    // kion fari?
    // eble doni informon, ke ni haltis!
}


async function trovu_respondon(seanco,respondo,maks_respondoj) {
    //const kadro = respondo.closest(".prolog-demando");
    await waiting(respondo);
    try {        
        const respondkodo = await sekva_respondo(seanco);
        if (respondkodo) {
            respondo.append(
                (pl.format_answer(respondkodo)).replace(/^true/,'jes')
                +(maks_respondoj>1?'; ':''));
            return respondkodo;
        } else {
            console.log("Neniu solvo trovita (false).");
            respondo.append('ne');
        }
    }
    finally {
        await waiting(respondo,false);
        respond_informo(seanco,respondo);
    }
}

function lininombroj(programElemento,start) {
    const kodo = programElemento.querySelector("code");
    const ln_pre = programElemento.querySelector(".lininombroj");

    const ln = kodo.innerText.match(/\n/g).length
    ln_pre.innerText = Array.from(
        { length: ln }, 
        (_, i) => start + i + 1
    ).join("\n");
    return start + ln;
}

function renombrado(programElemento) {
    const lr = /\n/g;
    const sr = /^(\d)+\n/;
    // ni komparas la lininombrojn en la programkodo
    // kun la nombritaj linioj
    const kodo = programElemento.querySelector("code").innerText;
    const nombroj = programElemento.querySelector(".lininombroj").innerText;

    console.log(`kodo: ${kodo.match(lr).length};  nmbr: ${nombroj.match(lr).length}`)

    if (kodo.match(lr).length != (nombroj.match(lr).length)) {
        // se ili diferencas ni devas renombrigi la programelementon
        // kaj anakaŭ ĉiujn pli postajn en la paĝo, ĉar ni traktas ilin
        // ĉiuj kune kiel programo
        let lpos = parseInt(nombroj.match(sr)[1], 10) - 1;
        lpos = lininombroj(programElemento,lpos);

        programElemento.parentElement.querySelectorAll(":scope ~ .programo").forEach((prg) => {
            lpos = lininombroj(prg,lpos);
        });
    }
}


/**
 * Ŝargas programon (faktoj kaj predikatoj), donitan kiel signaro, plej komforte kiel plurlinia
 * uzante klinitajn citilojn `...`
 * @param {*} programo 
 * @returns seancon por posta pridemandado
 */
function konsultu(programo,respondo,seanco) {
        
    return new Promise((resolve, reject) => {
        seanco.consult(programo, {
            success: () => resolve(seanco), // redonu la seancon por la sekva paŝo
            error: (err) => {
                console.error(`erara programo: ${err}`);
                tau_info(respondo,responderaro(err));
                reject(new Error(`erara programo: ${err}`))
            }
        });
    });
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

async function waiting(elemento, waiting=true) {
    //const cursor = waiting? 'wait' : 'default'; // aŭ 'progress'? - ĉu ni povas haltigi dum kalkulado
    //const background = waiting? 'gray' : 'none';    
    //elemento.style.cursor = cursor; 
    //elemento.style.background = background; 
    if (waiting) elemento.classList.add("kalkulante");
    else elemento.classList.remove("kalkulante");
    // donu al la retumilo tempon por montri la ŝanĝon
    // antaŭ ekkalkuli
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);  
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


function respond_informo(seanco,respondo) {
    const thread = seanco.thread;
    const msg = 
      `${thread.cpu_time}ms, ` +
      `${thread.total_steps} penseroj`;
    tau_info(respondo,msg);
};

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

