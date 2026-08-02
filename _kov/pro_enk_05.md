---
layout: laborfolio
title: 1.5 - Magia formulo
next_ch: pro_enk_06
js:
    - sekcio-0c
    - taupl.min
    - taupl-util-0c
css:
    - tau-prolog-0c
---

## Sorĉformulo el Faŭsto

Kiam Mefisto kun Faŭsto vizitas sorĉistinon por
junigi Faŭston ŝi elbabilas magian formulon.

En la germana:

   Du mußt versteh’n!\\
   Aus Eins mach Zehn,\\
   Und Zwei laß geh’n,\\
   Und Drei mach gleich,\\
   So bist Du reich.
   
   Verlier die Vier!\\
   Aus Fünf und Sechs,\\
   So sagt die Hex’,\\
   Mach Sieben und Acht,\\
   So ist's vollbracht:
   
   Und Neun ist Eins,\\
   Und Zehn ist keins.\\
   Das ist das Hexen-Einmaleins!

Ni provu, eble iom mallerte, traduki tion al Esperanto:

### Sorĉistina kalkulo

   Aŭskultu, ek!\\
   Unu jen dek,\\
   lasu la du,\\
   kaj tri tabu',

   Daŭrigu plu:\\
   Perdu la kvar!\\
   Sur kvin kaj ses,\\
   Sorĉista ŝanĝ',\\
   Jen sep kaj ok -\\
   La finaranĝ'.

   Jen naŭ en unu,\\
   Dek ne kunu,\\
   Vi fortunu!

Onidire temas pri magia kvadrato, t.e. kvadrato el trifoje tri ciferoj,
kies vicoj havas la saman sumon. Nu, ni elprovu tiun hipotezon.

<!--
```prolog
% helpiloj por sencimigi
:- op(950, fy, *). *(_).
```
{:.programo.kashita}
-->

### Antaŭkonsideroj

Por trovi konvenan magian kvadraton, ni povus naive elprovi ĉiujn kombinojn de 
naŭ nombroj, kalkuli la vicsumojn kaj se temas pri magia kvadrato, kompari kun la formulo,
ĉu ĝi kongruas kun la versoj.

Sed kiom da eblaj kombinoj entute ekzistas? La formulo mencias nombrojn ĝis dek.
Se ni ankaŭ akceptos la nulon, ni do devos elekti naŭ el dek unu nombroj. Se vi
ne scias la matematikan formulon por kombinoj, nu ni povas ankaŭ peti Prologon elkalkuli.
En la unua kampo de la kvadrato ni povas meti unu el dek unu nombroj, en la duan unu el ceteraj 
dek, en la trian kampon unu el naŭ ktp. Ni nur devas multipliki tiujn naŭ nombrojn 11 ĝis 3
por ricevi la nombron de kombinoj.

Ĉu vi povas fari tion? Vi povas aŭ difini tion per iteracio aŭ uzi unu el la listaj predikatoj
de Prologo por *faldi* liston, ekzemple `foldl/4`. 


```prolog
:- use_module(library(lists)).

nombro_kombinoj(K) :-
  % via vico...

```
{:.programo}


{% include pl-demando.html query=
  'nombro_kombinoj(K).' %}

Kiom vi ricevis? Ĉu ankaŭ preskaŭ 20 milionoj da? 
  
Nu, iom tro multaj se ni volas indulgi nian komputilon kaj paciencon. Do ni serĉu eblecon por limigi
la nombron de kombinoj elprovendaj.

<!-- 

Kiom da eblecoj forpreni du el 11 (11*10), modulo 1

-->


```prolog

magia_kvadrato_fausto :-
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
    S is C+F+I,
%    S is A+E+I,
%    S is C+E+G,
    maplist(writeln,K).

kombino([],_).

kombino([V|Vj],Nombroj) :- 
  select(V,Nombroj,Nombroj1),
  kombino(Vj,Nombroj1).    
```
{:.programo}


{% include pl-demando.html query=
  'vorto(Regul,Spc,satigantaj,Ana), 
   term_atom(Ana,Rezulto).' %}


<script>
  window.onload = () => {
    Faldajho.aranĝo("pl_kodo");
  }

  const limo = 1000000;  // evitu eternan kuron
  preparu_programojn();
  preparu_demandojn(() => {
      let programo = '';
      document.querySelectorAll('.programo code').forEach((c) => {
          programo += c.textContent;
      });
      return programo;
  }, limo);
</script>
