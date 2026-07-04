---
layout: laborfolio
title: Testo de Prologo
js:
    - tau-prolog
    - tau-prolog-util
---

<div id="id_dogo">dogo</div>

<svg xmlns="http://www.w3.org/2000/svg">
  <text id="id_pudelo" x="0" y="15">pudelo</text>
</svg>

<script>
    // trovebla per prop/2
    var besto = {
        speco: "hundo",
        raso: document.getElementById('id_dogo')
    }

    // ne trovebla per prop/2
    var pudelo = {
        speco: "hundo",
        raso: document.getElementById('id_pudelo')
    }

    // ne trovebla per prop/2
    let birdo = {
        speco: "paruo"
    }

    // uzebla en kunteksto, trovita per global/1
    function speco() {
        console.log("speco:" + besto.speco);
        return besto.speco;
    }
</script>

programo:
```prolog
:- use_module(library(dom)).
:- use_module(library(js)).
:- use_module(library(format)).
:- use_module(library(lists)).
:- use_module(library(charsio)).

var_speco(Speco) :-
    get_prop(besto,Besto), 
    get_prop(Besto,speco,Speco).

html_raso(Raso) :-
    get_prop(besto,Besto), 
    get_prop(Besto,raso,RasoElement),
    get_html(RasoElement,Raso).


svg_raso(Raso) :-
    get_prop(pudelo,Pudelo), 
    get_prop(Pudelo,raso,RasoSVGElement),
    get_html(RasoSVGElement,Raso).    

fun_speco(Speco) :-
    global(G), 
    apply(G,speco,[],Speco).

nova_speco(Speco) :-
    get_prop(besto,Besto), 
    set_prop(Besto,speco,kato).

my_format(Fs,Args) :- 
    current_output(Out),
    my_format(Out,Fs,Args).

my_format(Stream,Fs,Args) :- 
    phrase(format_(Fs,Args),Cs),(
        atom_chars(Msg,Cs),
        write(Stream,Msg)
    ).    

```
{: #programo contenteditable="true"}


demando ?- 
```prolog
var_speco(Vs), fun_speco(Fs), 
html_raso(Raso1), svg_raso(Raso2),
nova_speco(kato), var_speco(Nvs), fun_speco(NFs),
% skribiĝas la ret-konzolo
my_format("rasoj: ~w, ~w~n",[Raso1,Raso2]).

```
{: #demando contenteditable="true"}


<button id="rulu">Rulu</button>

<div id="respondo"></div>


<script>
    document.getElementById('rulu').addEventListener("click",()=>prologo());

    async function prologo() {
        const programo = document.querySelector('#programo code').textContent;
        console.log(programo);

        const seanco = await konsultu(pl,programo);
        await demando_respondo(seanco,'demando','respondo');
    }

    //prologo();
</script>
