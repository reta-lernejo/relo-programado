---
layout: home
title: Prologo
---

{% assign mat = site.prologo | sort: "title" %}
{% for t in mat %}
{% unless t.url contains "index" %}
  {% if t.title %}
  {% assign prefix = t.url | slice: 0, 18 %}
    {% if prefix == "/prologo/pro_romaj" %}
* [{{ t.title | escape }}]({{ t.url | relative_url }})
    {% endif %}  
  {% endif %}  
{% endunless %}
{% endfor %}
