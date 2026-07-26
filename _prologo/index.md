---
layout: home
title: Lecionoj de Prologo
---

## Prologo per romaj ciferoj

Interaga kurseto kun ekzercetoj 
enkondukanta en la bazajn konceptojn de Prologo.

{% assign pl = site.prologo | sort: "title" %}
{% for t in pl %}
{% unless t.url contains "index" %}
  {% if t.title %}
  {% assign prefix = t.url | slice: 0, 18 %}
    {% if prefix == "/prologo/pro_romaj" %}
* [{{ t.title | escape }}]({{ t.url | relative_url }})
    {% endif %}  
  {% endif %}  
{% endunless %}
{% endfor %}

## Analizo de esperantaj vortoj

Kiel uzi Prologon por difini nian propran gramatikon,
kiu analizas esperantajn vortojn derivitaj per afiksoj kaj finaĵoj.

{% assign pl = site.prologo | sort: "title" %}
{% for t in pl %}
{% unless t.url contains "index" %}
  {% if t.title %}
  {% assign prefix = t.url | slice: 0, 17 %}
    {% if prefix == "/prologo/pro_vana" %}
* [{{ t.title | escape }}]({{ t.url | relative_url }})
    {% endif %}  
  {% endif %}  
{% endunless %}
{% endfor %}

(daŭrigota)