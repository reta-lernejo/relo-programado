---
layout: laborfolio
title: Romaj ciferoj per Prologo 3
next_ch: pro_romaj_4
js:
    - tau-prolog
    - tau-prolog-util
css:
    - tau-prolog   
---

### Predikatoj, klaŭzoj, reguloj.

Por adicii romajn ciferojn ni devas difini *regulo*jn kiel fari tion. Ni komencu tute
simple:

```prolog
roma_cifero('I',1).
roma_cifero('V',5).
roma_cifero('X',10).
roma_cifero('L',50).
roma_cifero('C',100).
roma_cifero('D',500).
roma_cifero('M',1000).

roma_sumo(C1,C2,Sumo) :-
    roma_cifero(C1,V1),
    roma_cifero(C2,V2),
    VS is V1 + V2,
    roma_cifero(Sumo,VS).
```
{:.programo #romaj_ciferoj}

Do, kion faras la regulo `roma_sumo`? Ĝi eltrovas la valorojn de la du donitaj ciferoj,
adicias ilin kaj trovas roman ciferon, kies valoro egalas al la sumo. Nu, tio funkcias nur esceptokaze, 
ĉar la sumo kutime ne hazarde respondas al alia cifero. Jen elprovu:

{% include prolog-ekzerco.html query=
 "roma_sumo('V','V',Sumo)." %}

Antaŭ plibonigi tion, ni lernu ankoraŭ kelkajn terminojn: La nomojn de la kombinoj per kiujn ni donas faktojn kaj
regulojn, nomiĝas *predikato*j. Ili konsistigas rilaton inter siaj *argumento*j: La predikato `roma_cifero` difinas 
rilatojn inter la ciferoj I, V, X,... kaj iliaj valoroj (skribitaj kiel arabaj nombroj). La predikato `roma_sumo` 
difinas rilaton inter du ciferoj kaj tria cifero, kiu estas ilia sumo. 

Ĉar la nombro de argumentoj tiel gravas, por
distinig samnomajn predikatojn kun diversa nombro de argumentoj oni konvencie indikas tiujn: `roma_cifero/2`,
`roma_sumo/3`.

preczigu...:
Ambaŭ, faktoj kaj reguloj estas *klaŭzo*j. Regula klaŭzo havas *kapo*n kaj *korpo*n. La klaŭzo veriĝas, se troviĝas solvo de 
(instanciigo de la variabloj), tia ke kapo kaj korpo egaliĝas (*unuiĝas*).

Fakto estas speciala klaŭzo, kiu konsistas nur el la kapo. La korpon oni ne skribas, sed implicas ke ĝi ĉiam estas `true.` (vera).

### Rilato inter klaŭzoj de Prologo kaj datumbazoj

Se vi estas familiara kun datumbazoj, vi eble jam rimarkis, 
ke *fakto* estas ekvivalenta al horizontalo en *tabelo*.

**roma_cifero**

|roma|val|
|-- |--  |
|'I'|   1|
|'V'|   5|
|'X'|  10|
|'L'|  50|
|'C'| 100|
|'D'| 500|
|'M'|1000|

Demando al Prolog-programo kaj demando al datumbazo estas certagrade ekvivalentaj.
Kaj *regulo* estas iom analoga al *rigardo* en datumbazo:

```prolog
roma_sumo(C1,C2,Sumo) :-
    roma_cifero(C1,V1),
    roma_cifero(C2,V2),
    VS is V1 + V2,
    roma_cifero(Sumo,VS).
```

En SQL oni skribus ekzemple tiel:

```sql
CREATE VIEW roma_sumo AS
  SELECT r1.roma as C1, r2.roma as C2, sum.roma AS Sumo 
  FROM roma_cifero r1, roma_cifero r2, roma_cifero sum 
  WHERE sum.val = r1.val + r2.val;
```

Do anstataŭ `,` (kaj) en Prologo, en datumbazo oni uzas kunigon (angle: *join*). Tamen, ĉar Prologo estas plenkapabla programlingvo, 
ja reguloj estas multe pli esprimkapablaj ol SQL-komandoj, kiuj rapide longiĝas, komplikiĝas kaj tiam estas nur malfacile,
tempopostule senerarigeblaj.


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
        const programo = document.querySelector('#romaj_ciferoj code').innerText;
        
        const seanco = await konsultu(programo);
        tau_info(respondo,'');

        await demando_respondo(seanco,demando,respondo,maks_respondoj);
        informo(seanco,respondo);
    }

    preparu_programojn();
    preparu_ekzercojn(prologo);
</script>


