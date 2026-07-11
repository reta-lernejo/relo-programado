---
layout: laborfolio
title: Romaj ciferoj per Prologo 5
next_ch: pro_romaj_6
js:
    - tau-prolog
    - tau-prolog-util
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

{% include prolog-ekzerco.html query=
  "phrase(nombro,\"MCMXCIV\")." %}

Se ni donas signaron kun nevalida signo, la analizo malsukcesas.

{% include prolog-ekzerco.html query=
  "phrase(nombro,\"VICO\")." %}  

Nia gramatiko ja estas ankoraŭ tro naiva, ĉar ĝi ne konsideras la ordon de la ciferoj:

{% include prolog-ekzerco.html query=
  "phrase(nombro,\"VICI\")." %}

La gramatiko povas ankaŭ krei signarojn validajn laŭ ĝi:

{% include prolog-ekzerco.html n=10 query=
  "phrase(nombro,L), atom_chars(R,L)." %}

Nu, tiel la gramatiko ankoraŭ ne estas tute utila. En la sekva lekcio ni etendos ĝin do.

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