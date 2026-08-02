---
layout: laborfolio
title: Kompleksaj nombroj
next_ch: pro_enk_06
js:
    - sekcio-0c
    - taupl.min
    - taupl-util-0c
css:
    - tau-prolog-0c
---


```prolog

% helpiloj por sencimigi
:- op(950, fy, *). *(_).

% imaginara unuo
:- op(200, xf, i).

% realo / imaginaro
kompleks(Re, k(Re,0)) :- number(Re), !.
kompleks(Im i,k(0,Im)) :- number(Im), !.
kompleks(i, k(0, 1)) :- !.

% adicio
kompleks(+(A,B), k(Re, Im)) :-
  kompleks(A, k(ReA, ImA)),
  kompleks(B, k(ReB, ImB)),
  Re is ReA + ReB,
  Im is ImA + ImB.

% subtraho
kompleks(-(A,B), k(Re, Im)) :-
  kompleks(A, k(ReA, ImA)),
  kompleks(B, k(ReB, ImB)),
  Re is ReA - ReB,
  Im is ImA - ImB.

term_atom(k(Re,Im),A) :-
  atomic_list_concat([Re,+,Im,i],A).

```
{:.programo}

{% include pl-demando.html query=
  'kompleks((3+5i)+(1-2i),K), term_atom(K,A).' %}


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
