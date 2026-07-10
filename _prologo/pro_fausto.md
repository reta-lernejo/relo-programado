---
layout: laborfolio
title: Sorĉistina formulo
js:
    - tau-prolog
    - tau-prolog-util
css:
    - tau-prolog
---

### Rapidigo


```prolog
:- use_module(library(lists)).

magia_kvadrato_fausto(K) :-
    K = [[A,B,C],[D,E,F],[G,H,I]],
    S is 15, 

    % provizoraj supozoj lau la sorchformulo
    A is 10, E is 7, F is 8,
    kombino([B,C,D,G,H,I],[0,1,2,3,4,5,6,9]),

    S is A+B+C,
    S is D+E+F,
    S is G+H+I,
    S is A+D+G,
    S is B+E+H,
    S is C+F+I
    .
    %maplist(writeln,K).


kombino([],_).

kombino([V|Vj],Nombroj) :- 
  select(V,Nombroj,Nombroj1),
  kombino(Vj,Nombroj1).
```
{:.programo}


{% include prolog-ekzerco.html query=
  "magia_kvadrato_fausto(Q)." %}



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
            programo += c.parentElement.innerText;
        });

        const seanco = pl.create(limo);
        await konsultu(programo,respondo,seanco);
        await demando_respondo(seanco,demando,respondo,maks_respondoj);
        informo(seanco,respondo);
    };

    preparu_programojn();
    preparu_ekzercojn(prologo);
</script>  