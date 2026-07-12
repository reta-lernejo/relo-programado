---
layout: laborfolio
title: Romaj ciferoj per Prologo 1 - faktoj
chapter: "1. faktoj, demandoj"
next_ch: pro_romaj_2
js:
    - taupl.min
    - taupl-util-0b
css:
    - tau-prolog    
---

### Prologo pri Prologo

Se vi ankoraŭ ne spertiĝis pri la programlingvo Prologo, sed ja pri aliaj programlingvoj imperativaj 
aŭ funkcia, vi estu avertita: Prologo funkcias laŭ sufiĉe aliaj principoj. Vi devas lerni pensadon 
ne laŭ paŝoj de algoritmo, sed laŭ partoj de la problemo. La programparadigmon de Prologo oni nomas *deklara* 
aŭ *logika*. Oni ankaŭ parolas pri programlingvo de la *kvina generacio*.

Se alie, vi jam spertas pri datumbazoj, kaj scias kiel modeli laŭ tabeloj, rigardoj kaj formuli demandojn
al via datumbazo, tiam vi jam bone scias pensadon laŭ *rilatoj*. La demandlingvoj de datumbazoj kiel ekzemple
SQL ja estas *deklaraj*. Tio tre helpos al vi en Prologo. Ni detaligos tion ankoraŭ en la tria lekcio.

Por la interagaj ekzemploj en tiu ĉi kurseto ni uzas [τ-Prologon](https://tau-prolog.org/), 
realigitan en Javoskripto kaj funkcianta do plene en via retumilo.

### Faktoj kaj atomoj

Ni unue difinu la romajn ciferojn kiel *faktoj*, 
indikante ankaŭ ilian valoron en arabaj ciferoj. 
La ciferojn mem ni esprimas per *atomoj* (tio estas nomoj de niaj scieroj). Atomoj
devas aŭ esti minusklaj aŭ donitaj en citiloj.

```prolog
roma_cifero('I',1).
roma_cifero('V',5).
roma_cifero('X',10).
roma_cifero('L',50).
roma_cifero('C',100).
roma_cifero('D',500).
roma_cifero('M',1000).
```
{:.programo #romaj_ciferoj}

### Demandoj kaj variabloj

Poste ni povas pridemandi la donitajn faktojn pri romaj ciferoj laŭ diversaj manieroj. Ĉe tio ni uzas *variablojn*.
Variabloj devas esti majusklaj (sen citiloj). Atentu, ke variabloj en Prologo ne funkcias kiel variabloj 
en aliaj programlingvoj: ne ekzistas komando por ŝanĝi la valoron de variablo: `X = X + 1` ĉiam estas malvera,
same kiel en matematika formulo. Sed ja oni povas aserti `X1 = X + 1` por trovi solvojn al tia aserto.

1\. Kiom valoras la roma cifero `C`? (kun variablo `Valoro`)

{% include pl-demando.html query="roma_cifero('C',Valoro)." %}

2\. Kiu roma cifero havas la valoron kvindek?

{% include pl-demando.html query="roma_cifero(Roma,50)." %}

3\. Ĉu la roma cifero `D` havas la valoron mil?

{% include pl-demando.html query="roma_cifero('D',1000)." %}

*Tasko*: Ĉu vi povas ŝanĝi la supran demandon tiel, ke la respondo estos `jes`?

4\. Kiuj romaj ciferoj havas valoron pli grandan ol 50?

{% include pl-demando.html n="9" query="roma_cifero(Roma,Valoro), Valoro>50." %}

La komon legu kiel *kaj*, la punktokomon legu kiel *aŭ*! La fina `ne` signifas:
*ne* troviĝis plia solvo. En Prologo fakte uziĝas `true` (vera) kaj `false` (malvera).
Ni ŝanĝis ilin por tiu ĉi kurso al `jes` kaj `ne`.

5\. Kiuj romaj ciferoj havas valoron 50 aŭ 500?

{% include pl-demando.html n="9" query="roma_cifero(Roma,Valoro), (Valoro=50;Valoro=500)." %}


*Tasko*: Demandu pri ĉiuj romaj ciferoj, kies valoro estas cent aŭ pli malalta ol cent!
(Laŭplaĉe vi povas uzi punktokomon kiel 'aŭ', sed ankaŭ rilaton `=<`)

<script>
    const limo = 10000;  // evitu eternan kuron, ĉe la lasta (inversa demando)
    preparu_programojn();
    preparu_demandojn(() => {
        return document.querySelector('#romaj_ciferoj code').innerText
    }, limo);
</script>
