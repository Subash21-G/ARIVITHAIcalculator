import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
@Component({selector:'app-placeholder',imports:[RouterLink],template:`<section class="panel placeholder"><p class="eyebrow">ARIVITHAI Calculator</p><h1>{{title}}</h1><p>{{description}}</p><a routerLink="/">Back to calculator</a></section>`})
export class PlaceholderComponent { private route=inject(ActivatedRoute); title=this.route.snapshot.data['title'] as string; description=this.route.snapshot.data['description'] as string; }
