---
layout: home
title: Programado
---

{% assign pr = site.programado | sort: "title" %}
{% for t in pr %}
{% unless t.url contains "index" %}
  {% if t.title %}
* [{{ t.title | escape }}]({{ t.url | relative_url }})
  {% endif %}  
{% endunless %}
{% endfor %}
