---
layout: laborfolio
title: Romaj ciferoj per Prologo 5
next_ch: pro_romaj_6
js:
    - tau-prolog
    - taupl-util-0b
css:
    - tau-prolog
---

### Gramatikoj

Gramatikoj konsistas el predikatoj por analizi signarojn (pli ĝenerale listojn).
Oni uzas la operatoron `-->` por apartigi la kapon kaj la korpon de regulo. La kapo nomas 
elementon de la gramatiko kaj la korpo listigas signarojn kaj aliajn elementojn de la gramtiko.

Ni komencu per iom naiva gramatiko pri romaj nombroj: nombroj povas esti cifero aŭ cifero komence
sekvata de nombro. La ciferoj estas la konataj I, V, X ktp.

```prolog
nombro --> cifero.
nombro --> cifero, nombro.

cifero --> "I".
cifero --> "V".
cifero --> "X".
cifero --> "L".
cifero --> "C".
cifero --> "X".
cifero --> "M".
```
{:.programo}

Por apliki gramatikon al signaro oni uzas `phrase/2`, kies unua argumento estas
(la centra) elemento de la gramatiko (en nia kazo `nombro`) kaj la dua argumento estas
la analizenda signaro.

{% include pl-demando.html query=
  "phrase(nombro,\"MCMXCIV\")." %}

Se ni donas signaron kun nevalida signo, la analizo malsukcesas.

{% include pl-demando.html query=
  "phrase(nombro,\"VICO\")." %}  

Nia gramatiko ja estas ankoraŭ tro naiva, ĉar ĝi ne konsideras la ordon de la ciferoj:

{% include pl-demando.html query=
  "phrase(nombro,\"VICI\")." %}

La gramatiko povas ankaŭ krei signarojn validajn laŭ ĝi:

{% include pl-demando.html n=3999 query=
  "phrase(nombro,L), atom_chars(R,L)." %}

Nu, tiel la gramatiko ankoraŭ ne estas tute utila. En la sekva lekcio ni etendos ĝin do.

<script>
    const limo = 100000;  // evitu eternan kuron, ĉe la lasta (inversa demando)
    preparu_programojn();
    preparu_demandojn(() => {
        let programo = '';
        document.querySelectorAll('.programo code').forEach((c) => {
            programo += c.innerText;
        });
        return programo;
    }, limo);
</script>

