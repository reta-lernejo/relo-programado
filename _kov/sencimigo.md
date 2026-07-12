---
layout: laborfolio
title: sencimigo
js:
  - tau-prolog
  - tau-prolog-util
css:
  - tau-prolog  
---

<!-- 
  vd. https://stackoverflow.com/questions/30788208/gprolog-getting-a-stacktrace-after-an-exception
-->

programo:
```prolog
:- use_module(library(dom)).
:- use_module(library(js)).
:- use_module(library(format)).
:- use_module(library(lists)).
:- use_module(library(charsio)).

:- op(920, fx, [@,$,$-]).
:- op(950, fy, *).

% elskribu esceptojn okazantajn en la markita linio
$-(G_0) :-
   catch(G_0, Ex, ( portray_clause(exception:Ex:G_0), throw(Ex) ) ).

% elskribu eniron, evtl. escepton kaj eliron el la markita linio
$(G_0) :-
   portray_clause(call:G_0),
   $-G_0,
   portray_clause(exit:G_0).

% ĵetu escepton, se ne almenaŭ unu respondo plenumas la markitan linion
@(G_0) :-
   (   $-G_0
   *-> true
   ;   portray_clause(badfail:G_0),
       throw(goal_failed(G_0))
   ).

% transsaltu la markitan linion
*(_).

% belaranĝe elskribu la termon
portray_clause(Clause) :-
    copy_term(Clause, Copy),
    numbervars(Copy,0,_),
    write_term(Copy, [numbervars(true),quoted(true)]),
    write('.'), nl.

debugging(test).

debug(Topic,Fs,Args) :- 
  debugging(Topic),
  current_output(Stream),
  (atom(Fs) -> atom_chars(Fs,F); F=Fs),
  phrase(format_(F,Args),Cs),
  (
    atom_chars(Msg,Cs),
    write(Stream,Msg)
  ). 
```  
{:.programo}

---

```prolog
user:term_expansion(-->(Head, Body0), :-(Head1, Body1)) :-
    % Transformiere den Kopf der DCG (fügt S0 und S hinzu)
    dcg_translate_head(Head, S0, S, Head1),
    % Transformiere den Rumpf und reiche die DCG-Zustände durch
    dcg_translate_body(Body0, S0, S, Body1).

% Hilfsprädikate für die Transformation des Bodys:
dcg_translate_body($, _, _, _) :- 
    !, throw(error(instantiation_error, 'Operator $ braucht ein Argument')).

% Wenn wir auf $(Goal) stoßen:
dcg_translate_body($(G0), S0, S, $(G_Expanded)) :-
    !,
    dcg_translate_body(G0, S0, S, G_Expanded).

% Wenn wir auf $-(Goal) stoßen:
dcg_translate_body($-(G0), S0, S, $-(G_Expanded)) :-
    !,
    dcg_translate_body(G0, S0, S, G_Expanded).

% Wenn wir auf @(Goal) stoßen:
dcg_translate_body(@(G0), S0, S, @(G_Expanded)) :-
    !,
    dcg_translate_body(G0, S0, S, G_Expanded).

% Standard DCG-Kompilierung für alles andere (Verbundene Ziele, Terminale etc.)
% Hier greifen wir auf das eingebaute System-Prädikat zurück:
dcg_translate_body(Other, S0, S, Expanded) :-
    dcg_translate_rule((_ --> Other), (_ :- Expanded)),
    % Da dcg_translate_rule standardmäßig neue Variablen erzeugt,
    % binden wir sie an unsere aktuellen Zustände S0 und S:
    Expanded =.. [_|Args],
    append(_, [S0, S], Args).

% Hilfsfunktion für den Kopf
dcg_translate_head(Head, S0, S, HeadExpanded) :-
    Head =.. List,
    append(List, [S0, S], NewList),
    HeadExpanded =.. NewList.
```
{:.programo}

---


```prolog
baza_nombro(1000) --> "M".
baza_nombro(900)  --> "CM".
baza_nombro(500)  --> "D".
baza_nombro(400) --> "CD".
baza_nombro(100) --> "C".
baza_nombro(90) --> "XC".
baza_nombro(50) --> "L".
baza_nombro(40) --> "XL".
baza_nombro(10) --> "X".
baza_nombro(9) --> "IX".
baza_nombro(5) --> "V".
baza_nombro(4) --> "IV".
baza_nombro(1)    --> "I".

% dismeto de roma nombro en la suprajn bazajn unuojn
roma_dec([]) --> [].
roma_dec([V|Vs]) -->
    baza_nombro(V),!,
    roma_dec(Vs).

% dismeto de decimala nombro en la bazajn nombrojn
dec_roma(0) --> [].
dec_roma(Dec) -->
    { Dec > 0 },
    % trovu bazan nombron egalan aŭ malpli grandan ol Dec
    baza_nombro(Valoro),
    { Valoro =< Dec,       
      !, % tranĉo: ni ne testu ankoraŭ pli malgrandajn bazajn nombrojn
      Resto is Dec - Valoro 
    },
    dec_roma(Resto).

sum([],0).
sum([X|Xs],N) :-
    sum(Xs,R),
    N is X+R.

roma_nombro(Roma,Dec) :-
  ground(Roma),
  phrase(roma_dec(RL), Roma), sum(RL,Dec).

roma_nombro(Roma,Dec) :-
    number(Dec),
    phrase(dec_roma(Dec),Ciferoj),
    atom_chars(Roma,Ciferoj).
```
{:.programo}

Malĝusta roma nombro:

{% include pl-demando.html n=10 query=
  'roma_nombro("VXI",Dec).' %}


<script>

    const limo = 100000;  // evitu eternan kuron, ĉe la lasta (inversa demando)

    function informo(seanco,respondo) {
      const thread = seanco.thread;
      const msg = 
        `${thread.cpu_time}ms, ` +
        `${thread.total_steps} penseroj`;
      tau_info(respondo,msg);
    };

    async function prologo(demando,respondo,maks_respondoj) {
        let programo = '';
        document.querySelectorAll('.programo code').forEach((c) => {
            programo += c.innerText;
        });

        const seanco = pl.create(limo);
        await konsultu(programo,respondo,seanco);
        await demando_respondo(seanco,demando,respondo,maks_respondoj);
        informo(seanco,respondo);
    };

    preparu_programojn();
    preparu_ekzercojn(prologo);
</script>